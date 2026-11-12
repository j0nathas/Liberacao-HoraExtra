package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "logs_liberacao")
@Getter
@Setter
public class LogsLiberacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long id_device;

    private Long id_log;

    private Long id_user;

    private Integer id_funcionario;

    private Integer id_solicitacoes;

    private int id_logs_liberacao_eventos;

    private LocalDateTime data_liberacao;
}
