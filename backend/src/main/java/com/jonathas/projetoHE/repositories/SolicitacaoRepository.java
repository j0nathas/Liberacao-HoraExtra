package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.dto.query.HomeCountDTO;
import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    Optional<Solicitacao> findByToken(String token);

    @Transactional
    @Modifying
    @Query("""
    UPDATE Solicitacao s SET s.status = :status
    WHERE s.token = :token
""")
    int atualizarStatusPorToken(String token, String status);

    @EntityGraph(attributePaths = {
            "usuario",
            "solicitacoes",
            "solicitacoes.motivosMacro",
            "solicitacoes.tipo",
            "solicitacoes.departamento",
            "solicitacoes.turno",
            "solicitacoes.planta",
            "solicitacoes.justificativas",
            "solicitacoes.justificativas.maquina",
            "solicitacoes.justificativas.funcionarios",
            "solicitacoes.justificativas.funcionarios.funcionario"
    })
    List<Solicitacao> findAllByUsuarioIdAndStatusNotOrderByIdDesc(
            Long usuarioId,
            String status
    );

    @EntityGraph(attributePaths = {
            "usuario",
            "solicitacoes",
    })
    @Query("""
    SELECT s
    FROM Solicitacao s
    WHERE s.usuario.id = :usuarioId
      AND s.status <> :status
    ORDER BY s.id DESC
""")
    List<Solicitacao> findAllParaAcompanhamento(
            Long usuarioId,
            String status,
            Pageable pageable
    );

    @Query("""
            SELECT s.status, COUNT(s.status) AS contagem
            FROM Solicitacao s
            WHERE s.status <> 'deleted'
            GROUP BY s.status
    """)
    List<HomeCountDTO> homeCount(
            Long usuarioId
    );

}
