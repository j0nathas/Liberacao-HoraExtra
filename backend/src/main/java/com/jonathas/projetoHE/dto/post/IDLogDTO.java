package com.jonathas.projetoHE.dto.post;

import java.time.Instant;
import java.time.LocalDateTime;

public record IDLogDTO(Long deviceId, Long logId, Long userId, String nome, String matricula, LocalDateTime hora) {}
