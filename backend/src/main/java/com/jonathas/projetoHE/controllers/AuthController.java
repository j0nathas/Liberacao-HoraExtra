package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.auth.LoginRequestDTO;
import com.jonathas.projetoHE.dto.auth.LoginResponseDTO;
import com.jonathas.projetoHE.infra.security.TokenService;
import com.jonathas.projetoHE.services.LdapAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor // Cria o construtor para o LdapAuthService automaticamente (Lombok)
public class AuthController {
    private final LdapAuthService ldapAuthService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO data) {
        boolean isValid = ldapAuthService.authenticate(data.username(), data.password());

        if (isValid) {
            String token = tokenService.generateToken(data.username());
            return ResponseEntity.ok(new LoginResponseDTO(token)); // Devolve o JWT
        }

        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }
}
