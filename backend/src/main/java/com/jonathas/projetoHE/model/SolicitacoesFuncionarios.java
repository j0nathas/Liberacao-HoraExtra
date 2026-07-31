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
    @JoinColumn(name = "id_soli")
    @JsonIgnore // Evita o loop infinito
    private Solicitacoes solicitacoes;

    @ManyToOne
    @JoinColumn(name = "id_funcionario")
    private Funcionarios funcionario; // Removido o 's' para o JSON ficar claro

    @ManyToOne
    @JoinColumn(name = "id_maquina")
    private Departamento maquina; // Removido o 's'
}