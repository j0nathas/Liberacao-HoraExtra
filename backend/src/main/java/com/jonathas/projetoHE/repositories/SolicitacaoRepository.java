package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.Departamento;
import com.jonathas.projetoHE.model.MotivosMacro;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

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

}