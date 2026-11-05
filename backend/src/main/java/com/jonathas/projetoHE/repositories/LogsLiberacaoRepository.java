package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.LogsLiberacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;

public interface LogsLiberacaoRepository extends JpaRepository<LogsLiberacao, Long> {

    @Query("""
    SELECT TOP (1) FROM LogsLiberacao
    WHERE data_liberacao > :liberacao
    AND id_funcinario = :funcionario
""")
    <Optional>LogsLiberacao acharUltimoRegistroRecente(ZonedDateTime liberacao, Integer funcionario);

}
