package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacoes, Long> {
    Optional<Solicitacoes> findByToken(String token);
    List<Solicitacoes> findAllByToken(String token);
    @EntityGraph(attributePaths = {
            "usuario",
            "motivosMacro",
            "funcionarios",
            "funcionarios.funcionario",
            "funcionarios.maquina"
    })
    List<Solicitacoes> findAllByUsuarioIdOrderByIdDesc(Long usuarioId);

    @Transactional
    @Modifying
    @Query("""
    UPDATE Solicitacoes s SET s.status = :status
    WHERE s.token = :token
""")
    int atualizarStatusPorToken(String token, String status);

}