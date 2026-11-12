package com.jonathas.projetoHE.controlid.repositories;

import com.jonathas.projetoHE.controlid.model.Devices;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DevicesRepository extends JpaRepository<Devices, Long> {

    Devices findBySerial(String serial);
}
