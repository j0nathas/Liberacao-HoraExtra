package com.jonathas.projetoHE.controlid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Devices")
@Getter @Setter
public class Devices {

    @Id
    private Long id;

    private String serial;
}
