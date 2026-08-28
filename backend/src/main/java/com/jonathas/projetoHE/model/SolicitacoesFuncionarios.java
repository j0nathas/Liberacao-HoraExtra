package com.jonathas.projetoHE.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "solicitacoes_funcionarios")
@Getter @Setter
public class SolicitacoesFuncionarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_justificativa")
    @JsonIgnore
    private SolicitacoesJustificativas justificativa;

    @ManyToOne
    @JoinColumn(name = "id_funcionario")
    private Funcionarios funcionario;

}