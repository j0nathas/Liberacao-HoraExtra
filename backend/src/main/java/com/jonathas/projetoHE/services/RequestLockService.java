package com.jonathas.projetoHE.services;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RequestLockService {

    private final Set<Long> usuariosEmProcessamento = ConcurrentHashMap.newKeySet();

    public boolean adquirir(Long idUsuario) {
        return usuariosEmProcessamento.add(idUsuario);
    }

    public void liberar(Long idUsuario) {
        usuariosEmProcessamento.remove(idUsuario);
    }
}