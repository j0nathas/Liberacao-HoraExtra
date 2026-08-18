package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dept_resp")
@Getter
@Setter
public class DeptResp {

    @Id
    @Column(name = "id")
    Integer id;

    @Column(name = "departamento")
    private String departamento;

    @Column(name = "id_resp")
    private int idResp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_planta")
    private Plantas idPlanta;
}
