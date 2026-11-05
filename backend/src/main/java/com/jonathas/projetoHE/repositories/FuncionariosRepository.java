package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface FuncionariosRepository extends JpaRepository<Funcionarios, Long> {



    @Query("""
    SELECT f
    FROM Funcionarios f
    WHERE f.codigoEmpresa IN :codEmpresas
      AND (
          LOWER(f.name) LIKE LOWER(:pesquisa)
          OR LOWER(f.re) LIKE LOWER(:pesquisa)
      )
    """)
    List<Funcionarios> pesquisarComFiltro(@Param("pesquisa") String pesquisa, @Param("codEmpresas") List<String> codEmpresas, Pageable pageable);

    List<Funcionarios> findTop20ByOrderByNameAsc();

    @Query("""
    SELECT TOP (1) FROM Funcionarios
    WHERE Codigo_Registro = :re 
    AND Codigo_Empresa = 
""")
    Optional<Funcionarios> findByR(Long codigoEmpresa);
}
