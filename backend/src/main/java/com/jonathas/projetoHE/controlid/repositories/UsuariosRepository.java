package com.jonathas.projetoHE.controlid.repositories;

import com.jonathas.projetoHE.controlid.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {}