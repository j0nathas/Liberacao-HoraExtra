package com.jonathas.projetoHE.dto.query;

import com.jonathas.projetoHE.dto.query.TopHomeDTO;

import java.time.ZonedDateTime;
import java.util.List;

public record HomeInfoDTO(
        Long id,
        ZonedDateTime data,
        String status,
        List<TopHomeDTO> solicitacoes
) {
}
