package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.RespHE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RespHERepository extends JpaRepository<RespHE, Long> {

    Optional<RespHE> findByLogin(String login);

    Optional<RespHE> findByEmail(String email);
}