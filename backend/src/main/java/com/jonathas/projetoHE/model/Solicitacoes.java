package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
@NoArgsConstructor
public class Solicitacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private RespHE usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_motivo_macro")
    private MotivosMacro motivosMacro;

    @Column(name = "motivo_detalhado")
    private String motivoDetalhado;

    private String departamento;

    private String turno;

    private LocalDateTime inicio;
    private LocalDateTime fim;

    private String status;
    private String token;

}