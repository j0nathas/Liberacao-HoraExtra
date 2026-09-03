package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.zapsign.*;
import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.model.RespHE;
import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import com.jonathas.projetoHE.repositories.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ZapSignService {
    private final RestClient restClient;
    private final RespHeRepository respHeRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @Value("${zapsign.token}")
    private String token;

    @Value("${zapsign.tests.enabled}")
    private boolean testSignersEnabled;

    public DocumentResponseDTO criarDocumento(DocumentDTO dto) {

        List<String> departamentos = dto.getDepartamentos().stream()
                .map(dept -> dept.getDepartamento())
                .toList();

        List<RespHE> responsaveis = dto.getDepartamentos()
                .stream()
                .map(DeptResp::getIdResp)
                .distinct()
                .map(id -> respHeRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException(
                                "Responsável não encontrado: " + id
                        )))
                .toList();

        List<SignerRequestDTO> signatarios = IntStream.range(0, responsaveis.size())
                .mapToObj(i -> {
                    RespHE resp = responsaveis.get(i);

                    return SignerRequestDTO.builder()
                            .name(resp.getNome() + " " + resp.getSobrenome())
                            .email(resp.getEmail())
                            .authMode("assinaturaTela")
                            .sendAutomaticEmail(true)
                            .orderGroup(i + 1)
                            .build();
                })
                .collect(Collectors.toCollection(ArrayList::new));

        if(!testSignersEnabled){
            signatarios.add(
                    SignerRequestDTO.builder()
                            .name("Ederson Quesada")
                            .email("ederson.quesada@magna.com")
                            .authMode("assinaturaTela")
                            .sendAutomaticEmail(true)
                            .orderGroup(signatarios.size() + 1)
                            .build()
            );

            signatarios.add(
                    SignerRequestDTO.builder()
                            .name("Alessandro Bosica")
                            .email("alessandro.bosica@magna.com")
                            .authMode("assinaturaTela")
                            .sendAutomaticEmail(true)
                            .orderGroup(signatarios.size() + 1)
                            .build()
            );

            signatarios.add(
                    SignerRequestDTO.builder()
                            .name("Agnaldo Cervone")
                            .email("agnaldo.cervone@magna.com")
                            .authMode("assinaturaTela")
                            .sendAutomaticEmail(true)
                            .orderGroup(signatarios.size() + 1)
                            .build()
            );
        }

        DocsRequestDTO request =
                DocsRequestDTO.builder()
                        .name("⏰ | SOLICITAÇÃO HORA EXTRA - " + String.join(", ", departamentos))
                        .base64Pdf(dto.getBase64())
                        .disableSignerEmails(false)
                        .message("Documento Teste")
                        .brandName("Magna Lighting")
                        .signatureOrderActive(true)
                        .allowRefuseSignature(true)
//                        .oneClickActive(true)
//                        .requireSignature(false)
                        .createdBy(dto.getEmailResp())
                        .hasSimplifiedSignature(true)
                        .signers(signatarios)
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

    public DocInfoResponseDTO infoDocumento(String documentToken) {
        try {

            DocInfoResponseDTO response = restClient.get()
                    .uri("/docs/" + documentToken)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .body(DocInfoResponseDTO.class);

            if (response == null) {
                throw new RuntimeException(
                        "ZapSign retornou uma resposta vazia."
                );
            }

            return response;

        } catch (RestClientResponseException e) {

            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body: " + e.getResponseBodyAsString());

            throw new RuntimeException(
                    "Erro ao consultar documento na ZapSign.",
                    e
            );
        }
    }

    public DocInfoResponseDTO deletarDocumento(String documentToken) {
        try {
            Solicitacao solicitacaoPai = solicitacaoRepository.findByToken(documentToken)
                    .orElse(null);

            if (solicitacaoPai == null) {
                throw new RuntimeException(
                        "Solicitação não encontrada para o token: " + documentToken
                );
            }

            DocInfoResponseDTO response = restClient.delete()
                    .uri("/docs/" + documentToken)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .body(DocInfoResponseDTO.class);

            if (response == null) {
                throw new RuntimeException(
                        "ZapSign retornou uma resposta vazia."
                );
            }

            solicitacaoRepository.atualizarStatusPorToken(
                    documentToken,
                    "deleted"
            );

            return response;

        } catch (RestClientResponseException e) {

            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body: " + e.getResponseBodyAsString());

            throw new RuntimeException(
                    "Erro ao deletar documento na ZapSign.",
                    e
            );
        }
    }

    public DocRedirectDTO linkDocumento(String documentToken) {
        try {

            DocRedirectDTO response = restClient.get()
                    .uri("/docs/" + documentToken)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .body(DocRedirectDTO.class);

            if (response == null) {
                throw new RuntimeException(
                        "ZapSign retornou uma resposta vazia."
                );
            }

            return response;

        } catch (RestClientResponseException e) {

            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body: " + e.getResponseBodyAsString());

            throw new RuntimeException(
                    "Erro ao consultar documento na ZapSign.",
                    e
            );
        }
    }
}
