package com.jonathas.projetoHE.dto.query;

import java.time.ZonedDateTime;

public record SolicitacaoExportDTO(
        ZonedDateTime inicio,
        ZonedDateTime fim,
        String departamento,
        String empresa,
        String localDaHoraExtra,
        String chapa,
        String nome,
        String turno,
        String motivoMacro,
        String justificativa,
        String transporte,
        String status
) {
}
