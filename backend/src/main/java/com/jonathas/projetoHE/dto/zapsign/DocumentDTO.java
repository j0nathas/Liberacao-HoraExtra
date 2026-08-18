package com.jonathas.projetoHE.dto.zapsign;

import com.jonathas.projetoHE.model.DeptResp;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    String base64;
    String nomeResp;
    String sobrenomeResp;
    String emailResp;
    List<DeptResp> departamentos;
}
