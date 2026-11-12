package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.dto.query.FuncPortariaDTO;
import com.jonathas.projetoHE.model.PeriodoSolicitacoesProjection;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface SolicitacoesRepository extends JpaRepository<Solicitacoes, Long> {
    List<Solicitacoes> findBySolicitacaoId(Long id);

    @Query(value = """
    SELECT
        MIN(CAST(s.inicio AS DATE)) as dataMinima,
        MAX(CAST(s.inicio AS DATE)) as dataMaxima
    FROM Solicitacoes s
    """, nativeQuery = true)
    PeriodoSolicitacoesProjection buscarPeriodoSolicitacoes();

    @Query( value = """
        SELECT id FROM Solicitacoes
        WHERE :log BETWEEN DATEADD(HOUR, -2, inicio) AND fim
    """, nativeQuery = true)
    List<Integer> verificarSeTemSolicitacoes(@Param("log")LocalDateTime log);
}