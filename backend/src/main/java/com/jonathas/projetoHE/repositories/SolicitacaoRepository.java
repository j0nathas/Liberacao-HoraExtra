package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.Departamento;
import com.jonathas.projetoHE.model.MotivosMacro;
import com.jonathas.projetoHE.model.Solicitacoes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacoes, Long> {
    Optional<Solicitacoes> findByToken(String token);
}