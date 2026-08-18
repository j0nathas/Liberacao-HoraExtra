package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.Plantas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantasRepository extends JpaRepository<Plantas, String> {

}
