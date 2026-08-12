package com.jonathas.projetoHE.dto.query;

import java.time.LocalDate;

public record PeriodoSolicitacoesDTO(
        LocalDate dataMinima,
        LocalDate dataMaxima
) {}
