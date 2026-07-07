package com.jonathas.projetoHE.repositories;
import com.jonathas.projetoHE.model.MotivosMacro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MotivosMacroRepository extends JpaRepository<MotivosMacro, Long> {
}