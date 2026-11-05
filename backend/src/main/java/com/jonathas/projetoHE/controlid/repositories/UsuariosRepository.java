package com.jonathas.projetoHE.controlid.repositories;

import com.jonathas.projetoHE.controlid.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {

    Optional<Usuarios> findFirstByIdDeviceOrderByIdDesc(Long idDevice);

}