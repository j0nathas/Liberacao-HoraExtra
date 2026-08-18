package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "plantas")
@Getter
@Setter
public class Plantas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sigla;

    private String planta;
}
