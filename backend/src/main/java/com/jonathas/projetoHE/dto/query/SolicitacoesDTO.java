package com.jonathas.projetoHE.dto.query;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

public record SolicitacoesDTO(
        Long id,
        String motivoMacro, // Alterado para padrão Java
        String tipoSolicitacao,
        String departamento,
        String turno,
        ZonedDateTime inicio,
        ZonedDateTime fim,
        String planta,
        List<JustificativasDTO> justificativas
) {}
