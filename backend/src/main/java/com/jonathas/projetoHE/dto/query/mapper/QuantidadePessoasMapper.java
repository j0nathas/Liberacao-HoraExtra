package com.jonathas.projetoHE.dto.query.mapper;

import com.jonathas.projetoHE.dto.query.QntdePStatusDTO;
import com.jonathas.projetoHE.dto.query.QntdePTurnosDTO;
import com.jonathas.projetoHE.dto.query.QuantidadePessoasDTO;
import com.jonathas.projetoHE.dto.query.QuantidadePessoasProjecaoDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class QuantidadePessoasMapper {

    public List<QuantidadePessoasDTO> toDTO(List<QuantidadePessoasProjecaoDTO> rows) {
        if (rows == null || rows.isEmpty()) {
            return List.of();
        }

        // 1. Agrupa por Data (inicio) -> Status -> Turnos
        Map<LocalDate, Map<String, List<QuantidadePessoasProjecaoDTO>>> agrupadoPorDataEStatus = rows.stream()
                .collect(Collectors.groupingBy(
                        QuantidadePessoasProjecaoDTO::getInicio,
                        Collectors.groupingBy(QuantidadePessoasProjecaoDTO::getStatus)
                ));

        // 2. Transforma o Map aninhado na árvore de Records desejada
        return agrupadoPorDataEStatus.entrySet().stream()
                .map(entryData -> {
                    LocalDate inicio = entryData.getKey();
                    Map<String, List<QuantidadePessoasProjecaoDTO>> mapStatus = entryData.getValue();

                    List<QntdePStatusDTO> listaStatus = mapStatus.entrySet().stream()
                            .map(entryStatus -> {
                                String status = entryStatus.getKey();
                                List<QuantidadePessoasProjecaoDTO> rowsTurno = entryStatus.getValue();

                                List<QntdePTurnosDTO> listaTurnos = rowsTurno.stream()
                                        .map(r -> new QntdePTurnosDTO(
                                                r.getTurno(),
                                                r.getQuantidadeFuncionarios()
                                        ))
                                        .toList();

                                return new QntdePStatusDTO(status, listaTurnos);
                            })
                            .toList();

                    return new QuantidadePessoasDTO(inicio, listaStatus);
                })
                .sorted((d1, d2) -> d2.inicio().compareTo(d1.inicio())) // Ordena da data mais recente para a mais antiga
                .toList();
    }
}