package com.jonathas.projetoHE.dto.query;


import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public record ExportBodyDTO(
        ZonedDateTime data,
        String departamento,
        String empresa,
        String localDaHoraExtra,
        String chapa,
        String nome,
        String turno,
        String horaInicio,
        String horaTermino,
        String tempoGastoTotal,
        String motivoMacro,
        String justificativa,
        String transporte,
        String autorizado
) {}
