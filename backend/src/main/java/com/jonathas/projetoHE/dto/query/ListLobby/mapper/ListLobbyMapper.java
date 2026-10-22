package com.jonathas.projetoHE.dto.query.ListLobby.mapper;

import com.jonathas.projetoHE.dto.query.ListLobby.DatesDTO;
import com.jonathas.projetoHE.dto.query.ListLobby.EmployeesDTO;
import com.jonathas.projetoHE.dto.query.ListLobby.QueryDTO;
import com.jonathas.projetoHE.dto.query.ListLobby.ShiftsDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Component
public class ListLobbyMapper {

    public List<DatesDTO> toDiaList(List<QueryDTO> rows) {
        return rows.stream()
                .collect(Collectors.groupingBy(
                        QueryDTO::data,
                        TreeMap::new,
                        Collectors.groupingBy(
                                QueryDTO::turno,
                                TreeMap::new,
                                Collectors.toList())))
                .entrySet().stream()
                .map(dia -> new DatesDTO(
                        dia.getKey(),
                        dia.getValue().entrySet().stream()
                                .map(t -> new ShiftsDTO(t.getKey(), toFuncionarios(t.getValue())))
                                .toList()))
                .toList();
    }

    private List<EmployeesDTO> toFuncionarios(List<QueryDTO> rows) {
        return rows.stream()
                .collect(Collectors.toMap(
                        QueryDTO::re,
                        this::toFuncionario,
                        this::preferirAssinado,
                        LinkedHashMap::new))
                .values().stream()
                .toList();
    }

    private EmployeesDTO toFuncionario(QueryDTO row) {
        return new EmployeesDTO(row.nome(), row.re(), row.status());
    }

    private EmployeesDTO preferirAssinado(EmployeesDTO a, EmployeesDTO b) {
        return "signed".equalsIgnoreCase(a.status()) ? a : b;
    }
}
