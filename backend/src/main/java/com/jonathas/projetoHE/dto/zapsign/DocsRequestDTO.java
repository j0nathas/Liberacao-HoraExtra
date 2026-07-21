package com.jonathas.projetoHE.dto.zapsign;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocsRequestDTO {
    private String name;

    @JsonProperty("base64_pdf")
    private String base64Pdf;

    @JsonProperty("disable_signer_emails")
    private boolean disableSignerEmails;

    private String message;

    @JsonProperty("brand_name")
    private String brandName;

    @JsonProperty("created_by")
    private String createdBy;

    private List<SignerRequestDTO> signers;
}
