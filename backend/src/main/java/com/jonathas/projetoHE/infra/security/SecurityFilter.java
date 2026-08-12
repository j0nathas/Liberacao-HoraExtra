package com.jonathas.projetoHE.infra.security;

import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    RespHeRepository respHeRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = recoverToken(request);

        if (token != null) {
            String login = tokenService.validateToken(token);

            if (login != null && !login.isBlank()) {
                Optional<RespHE> usuarioOpt = respHeRepository.findByLogin(login);

                if (usuarioOpt.isPresent()) {
                    RespHE usuario = usuarioOpt.get();

                    List<SimpleGrantedAuthority> authorities = usuario.getRole()
                            .getPermissions()
                            .stream()
                            .map(p -> new SimpleGrantedAuthority(p.getNome()))
                            .toList();

                    var authentication = new UsernamePasswordAuthenticationToken(
                            login,
                            null,
                            authorities
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("access_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}