package com.jonathas.projetoHE.controlid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "Logs")
public class Logs {

    @Id
    private Long id;

    @Column(name = "time")
    private LocalDateTime data;
}
