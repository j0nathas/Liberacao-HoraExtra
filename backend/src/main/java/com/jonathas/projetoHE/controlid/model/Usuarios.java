package com.jonathas.projetoHE.controlid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Users", catalog = "controlid", schema = "dbo")
@Getter
@Setter
public class Usuarios {

    @Id
    Integer id;

    @Column(name = "name")
    String name;

    @Column(name = "registration")
    String re;
}
