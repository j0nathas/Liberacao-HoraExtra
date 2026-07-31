package com.jonathas.projetoHE.dto.zapsign;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    String base64;
    String nomeResp;
    String sobrenomeResp;
    String emailResp;
}
