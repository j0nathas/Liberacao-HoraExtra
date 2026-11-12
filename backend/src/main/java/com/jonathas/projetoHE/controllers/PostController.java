package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.controlid.services.SetConfigService;
import com.jonathas.projetoHE.dto.post.CIDLogsDTO;
import com.jonathas.projetoHE.dto.post.IDLogDTO;
import com.jonathas.projetoHE.dto.post.RhContagemEmailDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import com.jonathas.projetoHE.controlid.repositories.UsuariosRepository;
import com.jonathas.projetoHE.repositories.SolicitacoesRepository;
import com.jonathas.projetoHE.services.CorpoEmailService;
import com.jonathas.projetoHE.services.IDLogService;
import com.jonathas.projetoHE.services.SentEmailService;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.UnknownHostException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
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

    @Autowired
    private UsuariosRepository usuariosRepository;
    
    @Autowired
    private SetConfigService setConfigService;

    @Autowired
    private SolicitacoesRepository solicitacoesRepository;

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

    private final IDLogService idLogService;

    @PostMapping("/logControlID/dao")
    public ResponseEntity<Void> logControlID(@RequestBody CIDLogsDTO dto) {
        if (dto.objectChanges() != null) {
            for (var c : dto.objectChanges()) {
                if (!c.isNovoAccessLog()) continue;

                Long userId = c.userId();
                if (userId == null || userId == 0) {
                    System.out.println("Passagem de usuário não identificado");
                    continue;
                }

                LocalDateTime agora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

                List<Integer> listIdsSolicitacoes = solicitacoesRepository.verificarSeTemSolicitacoes(agora);

                if(listIdsSolicitacoes == null) return(null);

                usuariosRepository.findFirstByIdDeviceOrderByIdDesc(userId).ifPresentOrElse(
                        u -> {
                            System.out.println("Passou: " + u.getName() + " | RE " + u.getRe()
                                    + " | userId " + userId);

                            idLogService.enviar(new IDLogDTO(
                                    dto.deviceId(), c.id(), u.getId(), u.getName(), u.getRe(), agora));
                        },
                        () -> System.out.println("ID " + userId + " não encontrado na tabela users")
                );
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/set_config/control_id")
    public ResponseEntity<String> configControlID() throws UnknownHostException {

        setConfigService.setConfig();

        return ResponseEntity.ok("Configuração dos equipamentos Control iD finalizada.");
    }

}
