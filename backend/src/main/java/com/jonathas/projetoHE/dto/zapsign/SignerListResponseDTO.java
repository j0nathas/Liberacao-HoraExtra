package com.jonathas.projetoHE.dto.zapsign;

import java.time.LocalDateTime;

public record SignerListResponseDTO (
        String status,
        String status_code,
        String name,
        String email,
        LocalDateTime last_view_at,
        LocalDateTime signed_at
){
}
