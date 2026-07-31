package com.jonathas.projetoHE.dto.post;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

public record SolicitacoesDTO(

        ZonedDateTime data,

        String base64,

        int id_user,

       List<SolicitacaoDTO> solicitacoes

) {}
