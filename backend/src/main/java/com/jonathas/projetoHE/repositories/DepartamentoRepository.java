package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.Departamento;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> { // Mudei de Long para String

    @Query("SELECT d.maquina FROM Departamento d WHERE d.departamento = :selecao")
    List<String> maquinasPorDepartamento(@Param("selecao") String selecao);

    @Query("SELECT d.departamento FROM Departamento d GROUP BY d.departamento ORDER BY d.departamento DESC")
    List<String> listarDepartamentos();
}