package com.jonathas.projetoHE.dto.query.ListLobby;

import java.time.LocalDate;
import java.util.List;

public record DatesDTO(
        LocalDate data,
        List<ShiftsDTO> turnos
) {
}
