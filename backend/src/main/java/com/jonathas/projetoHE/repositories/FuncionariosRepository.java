package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuncionariosRepository extends JpaRepository<Funcionarios, Long> {
    List<Funcionarios> findTop20ByNomeOrReContainingIgnoreCase(String pesquisa);
}
