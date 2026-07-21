package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolicitacaoFuncionariosRepository extends JpaRepository<SolicitacoesFuncionarios, Long> {

    List<SolicitacoesFuncionarios> findAllBySolicitacoesId(Long id);
}
