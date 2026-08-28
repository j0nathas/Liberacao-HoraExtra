package com.jonathas.projetoHE.dto.post;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

public record SolicitacaoDTO(
        int id_motivo_macro,

        int id_tipo,

        int id_departamento,

        int id_turno,

        LocalDateTime inicio,

        LocalDateTime fim,

        int id_planta,

        List<JustificativasDTO>  justificativas



) {}
