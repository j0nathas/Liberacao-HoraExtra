package com.jonathas.projetoHE.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Entity
@Table(name = "Resp_HE")
@Getter @Setter
public class RespHE {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "ID_Resp")
    private Long id;

    @Column(name = "Login_Rede")
    private String login;

    @Column(name = "Email")
    private String email;

    @Column(name = "Nome")
    private String nome;

    @Column (name = "Sobrenome")
    private String sobrenome;

    private int RE;
}



