package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.PeriodoSolicitacoesProjection;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

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
}