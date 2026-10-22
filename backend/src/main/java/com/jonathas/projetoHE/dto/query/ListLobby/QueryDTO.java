package com.jonathas.projetoHE.dto.query.ListLobby;

import java.time.LocalDate;

public record QueryDTO(
        LocalDate data,
        String turno,
        String nome,
        String re,
        String status
) {
}
