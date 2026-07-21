package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.zapsign.DocsRequestDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentResponseDTO;
import com.jonathas.projetoHE.dto.zapsign.SignerRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZapSignService {
    private final RestClient restClient;

    @Value("${zapsign.token}")
    private String token;

    public DocumentResponseDTO criarDocumento(DocumentDTO dto) {

        DocsRequestDTO request =
                DocsRequestDTO.builder()
                        .name("⏰ | SOLICITAÇÃO HORA EXTRA - MANUFATURA")
                        .base64Pdf(dto.getBase64())
                        .disableSignerEmails(false)
                        .message("Documento Teste")
                        .brandName("Magna Lighting")
                        .createdBy(dto.getEmailResp())
                        .signers(List.of(

                                SignerRequestDTO.builder()
                                        .name("Jonathas Oliveira")
                                        .email("jonathas.oliveira@magna.com")
                                        .authMode("assinaturaTela")
                                        .sendAutomaticEmail(true)
                                        .build()

                                /*
                                SignerRequestDTO.builder()
                                        .name(dto.getNomeResp() + " " + dto.getSobrenomeResp())
                                        .email(dto.getEmailResp())
                                        .authMode("assinaturaTela")
                                        .sendAutomaticEmail(true)
                                        .build() */

                        ))
                        .build();


        try {

            ObjectMapper mapper = new ObjectMapper();

            String json = mapper.writeValueAsString(request);


            return restClient.post()
                    .uri("/docs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .body(json)
                    .retrieve()
                    .body(DocumentResponseDTO.class);

        } catch (RestClientResponseException e) {

            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Headers: " + e.getResponseHeaders());
            System.out.println("Body: " + e.getResponseBodyAsString());

            throw e;
        }

    }
}
