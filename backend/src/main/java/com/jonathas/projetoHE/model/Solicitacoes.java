package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
@NoArgsConstructor
public class Solicitacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ZonedDateTime data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private RespHE usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_motivo_macro")
    private MotivosMacro motivosMacro;

    @Column(name = "motivo_detalhado")
    private String motivoDetalhado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_departamento")
    private DeptResp departamento;

    private String turno;

    private ZonedDateTime inicio;
    private ZonedDateTime fim;

    private String status;
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_planta")
    private Plantas planta;

    @OneToMany(mappedBy = "solicitacoes", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SolicitacoesFuncionarios> funcionarios = new ArrayList<>();


}