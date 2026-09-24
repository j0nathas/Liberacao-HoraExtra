package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.query.ExportBodyDTO;
import com.jonathas.projetoHE.dto.query.SolicitacaoExportDTO;
import com.jonathas.projetoHE.model.PeriodoSolicitacoesProjection;
import com.jonathas.projetoHE.repositories.SolicitacaoRepository;
import com.jonathas.projetoHE.repositories.SolicitacoesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class APIController {

    private final SolicitacaoRepository solicitacaoRepository;

    private final SolicitacoesRepository solicitacoesRepository;

    private static final DateTimeFormatter FORMATO_DATA_HORA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final ZoneId ZONA_BRASIL =
            ZoneId.of("America/Sao_Paulo");

    @GetMapping("/exportar")
    public ResponseEntity<List<ExportBodyDTO>> exportar(
            @RequestParam(value = "inicio", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate inicioParam,

            @RequestParam(value = "fim", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fimParam
    ) {

        PeriodoSolicitacoesProjection periodo =
                solicitacoesRepository.buscarPeriodoSolicitacoes();

        LocalDate inicioData = (inicioParam != null)
                ? inicioParam
                : periodo.getDataMinima();

        LocalDate fimData = (fimParam != null)
                ? fimParam
                : periodo.getDataMaxima();

        if (inicioData.isAfter(fimData)) {
            return ResponseEntity.badRequest().build();
        }

        if (inicioData.isBefore(periodo.getDataMinima())
                || fimData.isAfter(periodo.getDataMaxima())) {
            return ResponseEntity.badRequest().build();
        }

        ZonedDateTime inicio = inicioData
                .atStartOfDay(ZONA_BRASIL);

        ZonedDateTime fim = fimData
                .atTime(23, 59, 59)
                .atZone(ZONA_BRASIL);

        List<SolicitacaoExportDTO> dados =
                solicitacaoRepository.buscarSolicitacoesParaExportacao(
                        inicio,
                        fim
                );

        List<ExportBodyDTO> resposta = dados.stream()
                .map(item -> new ExportBodyDTO(
                        item.inicio(),
                        item.departamento(),
                        item.empresa(),
                        item.localDaHoraExtra(),
                        item.chapa(),
                        item.nome(),
                        item.turno(),
                        item.inicio().format(FORMATO_DATA_HORA),
                        item.fim().format(FORMATO_DATA_HORA),
                        calcularTempoGasto(
                                item.inicio(),
                                item.fim()
                        ),
                        item.motivoMacro(),
                        item.justificativa(),
                        item.transporte(),
                        mapearStatus(item.status())
                ))
                .toList();

        return ResponseEntity.ok(resposta);
    }

    private String calcularTempoGasto(
            ZonedDateTime inicio,
            ZonedDateTime fim
    ) {
        Duration duracao = Duration.between(inicio, fim);

        return String.format(
                "%02d:%02d",
                duracao.toHours(),
                duracao.toMinutesPart()
        );
    }

    private String mapearStatus(String status) {
        return switch (status) {
            case "pending" -> "PEDIR AUTORIZAÇÃO";
            case "signed" -> "AUTORIZADO";
            case "recusado" -> "REPROVADO";
            default -> status;
        };
    }
}