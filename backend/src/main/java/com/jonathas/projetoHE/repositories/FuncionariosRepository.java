package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.dto.query.FuncPortariaDTO;
import com.jonathas.projetoHE.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDateTime;
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

   Funcionarios findFirstByReAndCodigoEmpresa(String re, String codigoEmpresa);

    @Query(value = """
    SELECT TOP (1) sols.id AS id_sol, logs.id AS id_log, cad.id as id, cad.Codigo_Registro as re, cad.Nome_Registro as nome
    FROM Cadastros_HE cad
    LEFT JOIN solicitacoes_funcionarios fun
           ON fun.id_funcionario = cad.id
    LEFT JOIN solicitacoes_justificativas jus
           ON jus.id = fun.id_justificativa
    LEFT JOIN solicitacoes sols
           ON sols.id = jus.id_solitacoes
        AND :log BETWEEN DATEADD(HOUR, -1, sols.inicio) AND sols.fim
    LEFT JOIN logs_liberacao logs ON logs.id_solicitacoes = sols.id AND logs.id_funcionario = cad.ID
          
    WHERE cad.Codigo_Registro = :logRe
      AND cad.Codigo_Empresa = '810'
        ORDER BY sols.id DESC
    """, nativeQuery = true)
    FuncPortariaDTO buscarFuncionarioNaLista(@Param("log") LocalDateTime inicio, @Param("logRe") String re);
}
