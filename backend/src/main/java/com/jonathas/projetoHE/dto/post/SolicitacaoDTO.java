package com.jonathas.projetoHE.dto.post;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

public record SolicitacaoDTO(
        String departamento,

        int id_motivo_macro,

        String motivo_detalhado,

        String turno,

        LocalDateTime inicio,

        LocalDateTime fim,

        List<SolicitacaoFuncionarioDTO> funcionarios

) {}
