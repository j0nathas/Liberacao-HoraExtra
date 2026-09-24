package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.dto.query.HomeCountDTO;
import com.jonathas.projetoHE.dto.query.SolicitacaoExportDTO;
import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
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
    List<Solicitacao> findAllByStatusNotOrderByIdDesc(
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
                AND s.usuario.id = :usuarioId
            GROUP BY s.status
    """)
    List<HomeCountDTO> homeCount(
            Long usuarioId
    );

    @Query("""
    SELECT new com.jonathas.projetoHE.dto.query.SolicitacaoExportDTO(
        sq.inicio,
        sq.fim,
        d.departamento,
        f.empresa,
        j.maquina.maquina,
        f.re ,
        f.name,
        t.turno,
        mm.descricao,
        j.justificativa,
        CAST(NULL AS string),
        s.status
    )
    FROM Solicitacao s
        JOIN s.solicitacoes sq
        JOIN sq.departamento d
        JOIN sq.turno t
        JOIN sq.motivosMacro mm
        JOIN sq.planta p
        JOIN sq.justificativas j
        JOIN j.funcionarios sf
        JOIN sf.funcionario f
    WHERE s.status <> 'deleted'
      AND sq.inicio >= :inicio
      AND sq.fim <= :fim
    ORDER BY sq.inicio
""")
    List<SolicitacaoExportDTO> buscarSolicitacoesParaExportacao(
            ZonedDateTime inicio,
            ZonedDateTime fim
    );

}
