package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_acesso")
@Getter
@Setter
public class LogAcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;
    private String acao;
    private LocalDateTime dataHora;
    private String ip;

    public LogAcesso() {}

    public LogAcesso(String login, String acao, String ip) {
        this.login = login;
        this.acao = acao;
        this.ip = ip;
        this.dataHora = LocalDateTime.now();
    }
}