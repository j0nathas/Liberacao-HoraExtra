package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final ZapSignService zapSignService;

    @PostMapping("/criarDoc")
    public ResponseEntity<?> criarDocumento(
            @RequestBody DocumentDTO dto,
            HttpServletRequest request
    ) {

        System.out.println("Cookie: " + request.getHeader("Cookie"));

        String resposta = zapSignService.criarDocumento(dto);

        return ResponseEntity.ok(resposta);
    }
}
