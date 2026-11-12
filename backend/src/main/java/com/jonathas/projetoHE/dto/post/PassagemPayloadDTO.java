package com.jonathas.projetoHE.dto.post;

import java.time.LocalDateTime;

public record PassagemPayloadDTO(LocalDateTime hora, String matricula, String nome, Integer userId, Integer solId) {
}
