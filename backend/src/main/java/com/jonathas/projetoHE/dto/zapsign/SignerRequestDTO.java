package com.jonathas.projetoHE.dto.zapsign;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignerRequestDTO {

    private String name;

    private String email;

    @JsonProperty("auth_mode")
    private String authMode;

    @JsonProperty("send_automatic_email")
    private Boolean sendAutomaticEmail;

}
