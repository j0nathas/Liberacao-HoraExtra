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

    private Long id_log;

    private Long id_user;

    private int id_funcionario;

    private int id_solicitacoes;

    private String status;

    private LocalDateTime data_liberacao;
}
