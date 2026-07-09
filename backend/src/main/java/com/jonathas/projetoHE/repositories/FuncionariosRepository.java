package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FuncionariosRepository extends JpaRepository<Funcionarios, Long> {



        @Query("SELECT f FROM Funcionarios f WHERE " +
                "LOWER(f.name) LIKE LOWER(:pesquisa) OR " +
                "LOWER(f.re) LIKE LOWER(:pesquisa)")
        List<Funcionarios> pesquisarComFiltro(@Param("pesquisa") String pesquisa, Pageable pageable);

    List<Funcionarios> findTop20ByOrderByNameAsc();
}
