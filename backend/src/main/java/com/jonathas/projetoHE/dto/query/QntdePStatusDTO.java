package com.jonathas.projetoHE.dto.query;

import java.util.List;

public record QntdePStatusDTO(
        String status,
        List<QntdePTurnosDTO> turnos
) {
}
