package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "solicitacoes_funcionarios")
@Getter // Se estiver usando Lombok
@Setter
public class SolicitacoesFuncionarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_soli")
    private Solicitacoes solicitacoes;

    @ManyToOne
    @JoinColumn(name = "id_funcionario")
    private Funcionarios funcionarios;

    @ManyToOne
    @JoinColumn(name = "id_maquina")
    private Departamento maquinas;
}
