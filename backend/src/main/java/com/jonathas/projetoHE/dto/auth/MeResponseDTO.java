package com.jonathas.projetoHE.dto.auth;

import java.util.Set;

public record MeResponseDTO(Long id, String login, String nome, String sobrenome, String email, Set<String> permissions) {}