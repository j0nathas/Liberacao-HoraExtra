package com.jonathas.projetoHE.model;

import java.time.LocalDateTime;

public interface SolicitacaoExportProjection {

    String getData();

    String getDepartamento();

    String getEmpresa();

    String getLocalDaHoraExtra();

    String getChapa();

    String getNome();

    String getTurno();

    LocalDateTime getHoraInicio();

    LocalDateTime getHoraTermino();

    String getTempoGastoTotal();

    String getMotivoMacro();

    String getJustificativa();

    String getTransporte();

    String getAutorizado();
}