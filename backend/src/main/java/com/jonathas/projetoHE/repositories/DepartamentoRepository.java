package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.Departamento;
import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.model.listaMaquinas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> { // Mudei de Long para String

    @Query("""
    SELECT d.codMaquina, d.maquina
    FROM Departamento d
    JOIN d.idDepartamento dept
    JOIN dept.idPlanta pln
    WHERE dept.departamento = :selecao
      AND pln.sigla = :planta
    ORDER BY d.codMaquina ASC
""")
    List<listaMaquinas> maquinasPorDepartamento(
            @Param("selecao") String selecao,
            @Param("planta") String planta
    );

    @Query("""
    SELECT DISTINCT dept
    FROM Departamento d
    JOIN d.idDepartamento dept
    JOIN dept.idPlanta plant
    WHERE plant.sigla = :planta
    ORDER BY dept.departamento ASC
""")
    List<DeptResp> listarDepartamentos(
            @Param("planta") String planta
    );

    @Query("""
    SELECT DISTINCT dr.departamento
    FROM Departamento d
    JOIN d.idDepartamento dr
    WHERE d.codCentroCusto = :codCC
""")
    Optional<String> findByCodCentroCusto(@Param("codCC") String codCC);

    Optional<Departamento> findByCodMaquina(String codMaquina);
}