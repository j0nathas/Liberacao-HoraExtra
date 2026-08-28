package com.jonathas.projetoHE.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "solicitacoes_justificativas")
@Getter
@Setter
public class SolicitacoesJustificativas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_solitacoes")
    @JsonIgnore
    private Solicitacoes solicitacoes;

    @Column(name = "justificativa")
    private String justificativa;

    @ManyToOne
    @JoinColumn(name = "id_maquina")
    private Departamento maquina;

    @OneToMany(mappedBy = "justificativa", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<SolicitacoesFuncionarios> funcionarios = new LinkedHashSet<>();

}
