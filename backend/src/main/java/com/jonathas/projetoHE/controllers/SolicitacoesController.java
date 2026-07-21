package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.post.SolicitacaoDTO;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.services.SolicitacaoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacoesController {

    private final SolicitacaoService solicitacaoService;

    @PostMapping("/enviar")
    public ResponseEntity<Long> salvar(
            @RequestBody SolicitacaoDTO dto,
            HttpServletRequest request 
    ) {

        Solicitacoes solicitacao =
                solicitacaoService.salvar(dto);

        return ResponseEntity.ok(solicitacao.getId());
    }
}
