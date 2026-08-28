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

    @Column(name = "COD_CENTRO_CUSTO")
    private String codCentroCusto;

    @Column(name = "DESC_DEPARTAMENTO")
    private String maquina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dept")
    private DeptResp idDepartamento;

}

