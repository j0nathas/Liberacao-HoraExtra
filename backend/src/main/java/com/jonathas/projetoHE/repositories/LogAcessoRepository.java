package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.LogAcesso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAcessoRepository extends JpaRepository<LogAcesso, Long> {
}