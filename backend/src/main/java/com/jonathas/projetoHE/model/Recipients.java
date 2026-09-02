package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "recipients")
@Getter
@Setter
public class Recipients {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_planta")
    private Plantas planta;

    private String email;
}
