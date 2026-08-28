package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.zapsign.DocInfoResponseDTO;
import com.jonathas.projetoHE.dto.zapsign.DocRedirectDTO;
import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import com.jonathas.projetoHE.repositories.SolicitacaoFuncionariosRepository;
import com.jonathas.projetoHE.repositories.SolicitacoesRepository;
import com.jonathas.projetoHE.repositories.SolicitacaoRepository;
import com.jonathas.projetoHE.services.CorpoEmailService;
import com.jonathas.projetoHE.services.SentEmailService;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final SentEmailService sentEmailService;
    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitacoesRepository solicitacoesRepository;
    private final CorpoEmailService corpoEmailService;
    private final SolicitacaoFuncionariosRepository solicitacaoFuncionariosRepository;
    private final RespHeRepository respHeRepository;
    private final ZapSignService  zapSignService;

    @Transactional
    @PostMapping("/zapsign")
    public ResponseEntity<Void> webhook(@RequestBody SignedBodyDTO dto) {
        log.info("Webhook ZapSign recebido. Token: {} - Status: {}", dto.token(), dto.status());

        Solicitacao solicitacaoPai = solicitacaoRepository.findByToken(dto.token())
                .orElse(null);

        if (solicitacaoPai == null) {
            return ResponseEntity.ok().build();
        }

        if ("recusado".equals(dto.status())) {
            solicitacaoRepository.atualizarStatusPorToken(dto.token(), dto.status());
            return ResponseEntity.ok().build();
        }

        if ("signed".equals(dto.status())) {
            try {
                List<Solicitacoes> solicitacoesFilhas = solicitacoesRepository.findBySolicitacaoId(solicitacaoPai.getId());

                Map<Long, List<SolicitacoesFuncionarios>> funcionariosPorSolicitacao = solicitacoesFilhas.stream()
                        .collect(Collectors.toMap(
                                Solicitacoes::getId,
                                s -> solicitacaoFuncionariosRepository.findAllBySolicitacaoFilhaId(s.getId())
                        ));

                List<RespHE> responsaveisDepto = solicitacoesFilhas.stream()
                        .map(Solicitacoes::getDepartamento)
                        .filter(Objects::nonNull)
                        .map(dept -> respHeRepository.findById(dept.getIdResp()).orElse(null))
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList();

                RespHE solicitante = solicitacaoPai.getUsuario();

                String[] destinatarios = Stream.concat(
                                responsaveisDepto.stream().map(RespHE::getEmail),
                                Stream.of(solicitante.getEmail())
                        )
                        .filter(Objects::nonNull)
                        .distinct()
                        .toArray(String[]::new);

                String nomesDeptos = solicitacoesFilhas.stream()
                        .map(s -> s.getDepartamento().getDepartamento())
                        .distinct()
                        .collect(Collectors.joining(", "));

                String corpoEmail = corpoEmailService.construirCorpoEmail(dto, solicitacoesFilhas, funcionariosPorSolicitacao);

                sentEmailService.enviarEmail(
                        destinatarios,
                        "Hora Extra Assinada - " + nomesDeptos,
                        corpoEmail
                );

                solicitacaoRepository.atualizarStatusPorToken(dto.token(), dto.status());
                log.info("Processamento de assinatura finalizado com sucesso para o ID Pai: {}", solicitacaoPai.getId());

            } catch (Exception e) {
                log.error("Erro ao processar e-mails da solicitação {}: {}", solicitacaoPai.getId(), e.getMessage());
            }
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/infoDocZapSign")
    public ResponseEntity<DocRedirectDTO> linkDocumentoInfo(
            @RequestParam(name = "token") String tokenDoc
    ) {
        return ResponseEntity.ok(
                zapSignService.linkDocumento(tokenDoc)
        );
    }
}