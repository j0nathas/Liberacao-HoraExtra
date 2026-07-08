package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Cadastros_HE")
@Getter
@Setter
public class Funcionarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "ID")
    private Long id;

    @Column(name = "Codigo_Registro")
    private String re;

    @Column(name = "Nome_Registro")
    private String name;

   @Column(name = "Nome_Cargo")
    private String cargo;

    @Column(name = "Descricao_Mao_Obra")
    private String maoObra;

    @Column(name = "Codigo_CentroCusto")
    private String centroCusto;

    @Column(name = "Nome_Empresa")
    private String empresa;

}

