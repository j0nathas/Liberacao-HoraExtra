package com.jonathas.projetoHE.dto.zapsign;

import java.util.List;

public record DocInfoResponseDTO(
        String status,
        List<SignerListResponseDTO> signers
) {}
