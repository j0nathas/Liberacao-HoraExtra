package com.jonathas.projetoHE.dto.zapsign;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {

    private String base64;
    private String nomeResp;
    private String sobrenomeResp;
    private String emailResp;

}
