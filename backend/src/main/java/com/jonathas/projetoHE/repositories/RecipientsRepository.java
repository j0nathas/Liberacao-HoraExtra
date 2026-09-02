package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Recipients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipientsRepository extends JpaRepository<Recipients, String> {

    @Query("""
        SELECT DISTINCT r.email
        FROM Recipients r
        WHERE r.planta.id IN :idPlantas
    """)
    List<String> findEmailsByPlantas(@Param("idPlantas") List<Long> idPlantas);
}
