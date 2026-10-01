package com.jonathas.projetoHE.dto.query;

import java.time.ZonedDateTime;
import java.util.List;

public record SolicitacaoDTO (
        Long id,
        ZonedDateTime data,
        String nome,
        String sobrenome,
        String status,
        String token,
        List<SolicitacoesDTO> solicitacoes
){}
