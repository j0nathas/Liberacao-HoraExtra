package com.jonathas.projetoHE.dto.query.ListLobby;

import java.util.List;

public record ShiftsDTO(
        String turno,
        List<EmployeesDTO> funcionarios
) {
}
