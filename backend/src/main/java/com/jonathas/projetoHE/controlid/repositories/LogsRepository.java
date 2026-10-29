package com.jonathas.projetoHE.controlid.repositories;

import com.jonathas.projetoHE.controlid.model.Logs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogsRepository extends JpaRepository<Logs, Long> {
}
