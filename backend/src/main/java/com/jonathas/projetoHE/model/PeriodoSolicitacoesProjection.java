package com.jonathas.projetoHE.model;

import java.time.LocalDate;

public interface PeriodoSolicitacoesProjection {

    LocalDate getDataMinima();

    LocalDate getDataMaxima();
}
