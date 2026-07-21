package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.model.LogAcesso;
import com.jonathas.projetoHE.repositories.LogAcessoRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    @Autowired
    private LogAcessoRepository logRepository;

    public void registrar(String login, String acao, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        LogAcesso log = new LogAcesso(login, acao, ip);
        logRepository.save(log);
    }
}
