package com.jonathas.projetoHE.dto.post;

import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoDTO(

        LocalDateTime data,

        int id_user,

        int id_motivo_macro,

        String motivo_detalhado,

        String departamento,

        String turno,

        LocalDateTime inicio,

        LocalDateTime fim,

        List<SolicitacaoFuncionarioDTO> funcionarios

) {}
