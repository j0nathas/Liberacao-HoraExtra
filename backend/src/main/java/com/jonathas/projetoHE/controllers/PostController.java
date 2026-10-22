package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.post.RhContagemEmailDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import com.jonathas.projetoHE.services.CorpoEmailService;
import com.jonathas.projetoHE.services.SentEmailService;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final ZapSignService zapSignService;
    private final CorpoEmailService corpoEmailService;
    private final SentEmailService sentEmailService;

    @PostMapping("/criarDoc")
    public ResponseEntity<?> criarDocumento(
            @RequestBody DocumentDTO dto
    ) {

        String resposta = String.valueOf(zapSignService.criarDocumento(dto));

        return ResponseEntity.ok(resposta);
    }

    @Value("${email.restaurante}")
    private String emailRestaurante;

    @Autowired
    private RespHeRepository respHeRepository;

    @PostMapping("/emailRestaurante")
    public ResponseEntity<?> emailRestaurante(
            @RequestBody RhContagemEmailDTO dto,
            Authentication authentication
            ) {
            String corpoEmail = corpoEmailService.construirCorpoEmailRestaurante(dto);

        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        String[] destinatarios = {emailRestaurante, usuario.getEmail()};
        sentEmailService.enviarEmail(
                destinatarios,
                "Hora Extra - Refeições por Turno",
                corpoEmail
        );

        return ResponseEntity.ok().build();
    }

}
