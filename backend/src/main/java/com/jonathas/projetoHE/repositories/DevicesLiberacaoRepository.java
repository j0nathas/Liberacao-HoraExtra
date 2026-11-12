package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.DevicesLIberacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DevicesLiberacaoRepository extends JpaRepository<DevicesLIberacao, Integer> {

    DevicesLIberacao findByDeviceId(Long deviceId);
}
