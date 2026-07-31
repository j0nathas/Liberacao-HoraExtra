package com.jonathas.projetoHE.dto.post;

public record SolicitacaoResponseDTO(
        Long id,
        String status,
        String token,
        String departamento
        // outros campos relevantes para o cliente
) {}
