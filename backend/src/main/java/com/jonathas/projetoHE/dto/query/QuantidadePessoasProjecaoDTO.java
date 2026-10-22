package com.jonathas.projetoHE.dto.query;

import java.time.LocalDate;

public interface QuantidadePessoasProjecaoDTO {
    String getStatus();
    LocalDate getInicio();
    String getTurno();
    Integer getQuantidadeFuncionarios();
}