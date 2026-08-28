package com.jonathas.projetoHE.dto.query;

import java.time.ZonedDateTime;
import java.util.List;

public record SolicitacaoDTO (
        Long id,
        ZonedDateTime data,
        String usuario,
        String status,
        String token,
        List<SolicitacoesDTO> solicitacoes
){}
