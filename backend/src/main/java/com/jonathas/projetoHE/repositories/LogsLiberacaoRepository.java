package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.LogsLiberacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.Optional;

public interface LogsLiberacaoRepository extends JpaRepository<LogsLiberacao, Long> {

    @Query("""
        SELECT l FROM LogsLiberacao l
        WHERE l.data_liberacao > :liberacao
        AND l.id_funcionario = :funcionario
        ORDER BY l.data_liberacao DESC
        LIMIT 1
    """)
    Optional<LogsLiberacao> acharUltimoRegistroRecente(@Param("liberacao") ZonedDateTime liberacao,
                                                       @Param("funcionario") Integer funcionario);
}