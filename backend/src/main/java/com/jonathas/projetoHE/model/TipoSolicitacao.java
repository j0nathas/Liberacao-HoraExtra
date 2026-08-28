package com.jonathas.projetoHE.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "tipo_solicitacao")
@Getter
@Setter
public class TipoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo")
    private String tipo_solicitacao;

    @Column(name = "tempo_limite")
    private Integer limite;
}
