package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.post.SolicitacaoResponseDTO;
import com.jonathas.projetoHE.dto.post.SolicitacoesDTO;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.services.SolicitacaoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacoesController {

    private final SolicitacaoService solicitacaoService;

    @PostMapping("/enviar")
    public ResponseEntity<List<SolicitacaoResponseDTO>> salvar(
            @RequestBody SolicitacoesDTO dto,
            HttpServletRequest request
    ) {
        List<Solicitacoes> solicitacoes = solicitacaoService.salvar(dto);

        List<SolicitacaoResponseDTO> response = solicitacoes.stream()
                .map(s -> new SolicitacaoResponseDTO(
                        s.getId(),
                        s.getStatus(),
                        s.getToken(),
                        s.getDepartamento() != null
                                ? s.getDepartamento().getDepartamento()
                                : null
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
