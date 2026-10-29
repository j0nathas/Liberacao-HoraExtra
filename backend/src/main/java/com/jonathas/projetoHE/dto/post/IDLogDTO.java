package com.jonathas.projetoHE.dto.post;

import java.time.Instant;

public record IDLogDTO(Long userId, String nome, String matricula, Instant hora) {}
