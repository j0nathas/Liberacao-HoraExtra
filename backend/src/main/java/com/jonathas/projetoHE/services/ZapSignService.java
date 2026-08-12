package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.zapsign.DocsRequestDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentResponseDTO;
import com.jonathas.projetoHE.dto.zapsign.SignerRequestDTO;
import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.repositories.RespHeRepository;
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
    private final RespHeRepository respHeRepository;

    @Value("${zapsign.token}")
    private String token;

    public DocumentResponseDTO criarDocumento(DocumentDTO dto) {

        DocsRequestDTO request =
                DocsRequestDTO.builder()
                        .name("⏰ | SOLICITAÇÃO HORA EXTRA - LOGISTICA")
                        .base64Pdf(dto.getBase64())
                        .disableSignerEmails(false)
                        .message("Documento Teste")
                        .brandName("Magna Lighting")
                        .createdBy(dto.getEmailResp())
                        .signers(List.of(



//                                SignerRequestDTO.builder()
//                                        .name("Ederson Quesada")
//                                        .email("ederson.quesada@magna.com")
//                                        .authMode("assinaturaTela")
//                                        .sendAutomaticEmail(true)
//                                        .build(),
//
//                                SignerRequestDTO.builder()
//                                        .name("Eduardo Araujo")
//                                        .email("eduardo.araujo@magna.com")
//                                        .authMode("assinaturaTela")
//                                        .sendAutomaticEmail(true)
//                                        .build(),
//
//                                SignerRequestDTO.builder()
//                                        .name("Agnaldo Cervone")
//                                        .email("agnaldo.cervone@magna.com")
//                                        .authMode("assinaturaTela")
//                                        .sendAutomaticEmail(true)
//                                        .build(),
//
//                                SignerRequestDTO.builder()
//                                        .name("Vanessa Giraldi")
//                                        .email("vanessa.giraldi@magna.com")
//                                        .authMode("assinaturaTela")
//                                        .sendAutomaticEmail(true)
//                                        .build()

                                SignerRequestDTO.builder()
                                        .name("Jonathan Veloso")
                                        .email("jonathan.veloso@magna.com")
                                        .authMode("assinaturaTela")
                                        .sendAutomaticEmail(true)
                                        .build()

//                                SignerRequestDTO.builder()
//                                        .name("Fabricio Fonseca")
//                                        .email("FABRICIO.FONSECA@magna.com")
//                                        .authMode("assinaturaTela")
//                                        .sendAutomaticEmail(true)
//                                        .build()

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

            DocumentResponseDTO response = restClient.post()
                    .uri("/docs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .body(json)
                    .retrieve()
                    .body(DocumentResponseDTO.class);

            if (response == null) {
                throw new RuntimeException("ZapSign retornou uma resposta vazia.");
            }

            return response;

        } catch (RestClientResponseException e) {

            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body: " + e.getResponseBodyAsString());

            throw new RuntimeException("Erro ao criar documento na ZapSign.", e);

        } catch (Exception e) {

            throw new RuntimeException("Falha ao comunicar com a ZapSign.", e);
        }

    }
}
