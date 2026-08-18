package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.services.CorpoEmailService;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import com.jonathas.projetoHE.repositories.SolicitacaoFuncionariosRepository;
import com.jonathas.projetoHE.repositories.SolicitacaoRepository;
import com.jonathas.projetoHE.services.SentEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final SentEmailService sentEmailService;
    private final SolicitacaoRepository solicitacaoRepository;
    private final CorpoEmailService corpoEmailService;
    private final SolicitacaoFuncionariosRepository solicitacaoFuncionariosRepository;

    @PostMapping("/zapsign")
    public ResponseEntity<Void> webhook(@RequestBody SignedBodyDTO dto) {

        List<Solicitacoes> solicitacoes = solicitacaoRepository.findAllByToken(dto.token());

        if (solicitacoes.isEmpty()) {
            return ResponseEntity.ok().build();
        }

        if ("signed".equals(dto.status())) {
            try {
                Map<Long, List<SolicitacoesFuncionarios>> funcionariosPorSolicitacao = solicitacoes.stream()
                        .collect(Collectors.toMap(
                                Solicitacoes::getId,
                                s -> solicitacaoFuncionariosRepository.findAllBySolicitacoesId(s.getId())
                        ));

                String corpoEmail = corpoEmailService.construirCorpoEmail(dto, solicitacoes, funcionariosPorSolicitacao);

                String departamentos = solicitacoes.stream()
                        .map(Solicitacoes::getDepartamento)
                        .filter(Objects::nonNull)
                        .map(DeptResp::getDepartamento)
                        .distinct()
                        .collect(Collectors.joining(", "));

                String[] emails = {"jonathas.oliveira@magna.com"};

                sentEmailService.enviarEmail(
                        emails,
                        "Hora Extra Assinada - " + departamentos,
                        corpoEmail
                );

                solicitacaoRepository.atualizarStatusPorToken(dto.token(), dto.status());

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok().build();
    }
}