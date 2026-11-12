package com.jonathas.projetoHE.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "devices_liberacao")
@Getter
@Setter
public class DevicesLIberacao {

    @Id
    private int id;

    @Column(name = "device_id")
    private Long deviceId;

    private String serial;
}
