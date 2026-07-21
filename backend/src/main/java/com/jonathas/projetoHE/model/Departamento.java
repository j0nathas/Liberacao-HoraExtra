package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "Dept_HE")
@Getter
@Setter
public class Departamento {

    @Id
    @Column(name = "COD_MAQUINA")
    String codMaquina;

    @Column(name = "DESC_MAQUINA")
    private String maquina;

    @Column(name = "SETOR_PADRAO")
    private String departamento;

}

