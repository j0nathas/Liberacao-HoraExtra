package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

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
    List<Solicitacao> findAllByUsuarioIdOrderByIdDesc(Long usuarioId);
}
