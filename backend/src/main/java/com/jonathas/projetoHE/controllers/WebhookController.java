package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
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

import java.util.List;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    /*
    private final ZapSignService zapSignService;

    @PostMapping("/criarDoc")
    public ResponseEntity<?> criarDocumento(
            @RequestBody DocumentDTO dto,
            HttpServletRequest request
    ) {

        System.out.println("Cookie: " + request.getHeader("Cookie"));

        String resposta = String.valueOf(zapSignService.criarDocumento(dto));

        return ResponseEntity.ok(resposta);
    } */

    private final SentEmailService sentEmailService;
    private final SolicitacaoRepository solicitacaoRepository;
    private final CorpoEmailService corpoEmailService; // Nome corrigido
    private final SolicitacaoFuncionariosRepository solicitacaoFuncionariosRepository;

    @PostMapping("/zapsign")
    public ResponseEntity<Void> webhook(@RequestBody SignedBodyDTO dto) {

        var solicitacaoOpt = solicitacaoRepository.findByToken(dto.token());

        if (solicitacaoOpt.isEmpty()) {
            return ResponseEntity.ok().build();
        }

        Solicitacoes solicitacao = solicitacaoOpt.get();

        if ("signed".equals(dto.status())) {
            try {
                List<SolicitacoesFuncionarios> funcionarios =
                        solicitacaoFuncionariosRepository.findAllBySolicitacoesId(solicitacao.getId());

                String corpoEmail = corpoEmailService.construirCorpoEmail(dto, solicitacao, funcionarios);

                String[] emails = {"jonathas.oliveira@magna.com", "jonathan.veloso@magna.com", "FABRICIO.FONSECA@magna.com"};

                sentEmailService.enviarEmail(
                        emails,
                        "Hora Extra Assinada - " + solicitacao.getDepartamento(),
                        corpoEmail
                );

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok().build();
    }

}
