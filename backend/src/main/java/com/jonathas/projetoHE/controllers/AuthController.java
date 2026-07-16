package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.auth.LoginRequestDTO;
import com.jonathas.projetoHE.dto.auth.LoginResponseDTO;
import com.jonathas.projetoHE.dto.auth.MeResponseDTO;
import com.jonathas.projetoHE.infra.security.TokenService;
import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import com.jonathas.projetoHE.services.LdapAuthService;
import com.jonathas.projetoHE.services.LogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.time.Duration;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {
    private final LdapAuthService ldapAuthService;
    private final TokenService tokenService;
    @Autowired
    private RespHeRepository respHeRepository;

    @Autowired
    private LogService logService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO data, HttpServletRequest request) {
        boolean isValid = ldapAuthService.authenticate(data.username(), data.password());

        if (isValid) {
            boolean isEmail = data.username().contains("@");

            Optional<RespHE> usuario = isEmail ?
                    respHeRepository.findByEmail(data.username()) :
                    respHeRepository.findByLogin(data.username());

            if (usuario.isEmpty()){
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("USER_NOT_REGISTERED");
            }

            logService.registrar(usuario.get().getLogin(), "LOGIN", request);

            String token = tokenService.generateToken(usuario.get().getLogin());

            ResponseCookie cookie = ResponseCookie.from("access_token", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofMinutes(15))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(
                            new LoginResponseDTO(
                                    null,
                                    usuario.get().getNome(),
                                    usuario.get().getLogin(),
                                    usuario.get().getSobrenome()
                            )
                    );
        }

        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        String login = SecurityContextHolder.getContext().getAuthentication().getName();

        if (login != null && !login.equals("anonymousUser")) {
            logService.registrar(login, "LOGOUT", request);
        }

        ResponseCookie cookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }


    @GetMapping("/me")
    public ResponseEntity<MeResponseDTO> me(Authentication authentication) {
        System.out.println("Entrou no /me");

        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return ResponseEntity.ok(
                new MeResponseDTO(
                        usuario.getId(),
                        usuario.getLogin(),
                        usuario.getNome(),
                        usuario.getSobrenome(),
                        usuario.getEmail()
                )
        );
    }
}
