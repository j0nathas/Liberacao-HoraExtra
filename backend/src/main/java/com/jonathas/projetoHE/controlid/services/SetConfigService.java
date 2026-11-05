package com.jonathas.projetoHE.controlid.services;

import com.jonathas.projetoHE.controlid.DTO.LoginRequest;
import com.jonathas.projetoHE.controlid.DTO.LoginResponse;
import com.jonathas.projetoHE.controlid.DTO.MonitorRequest;
import com.jonathas.projetoHE.controlid.DTO.SetConfigRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.ObjectMapper;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SetConfigService {

    @Value("${controlid.login}")
    private String login;

    @Value("${controlid.senha}")
    private String senha;

    @Value("${server.port}")
    private String port;

    @Value("${controlid.ips}")
    private List<String> ips;

    private final RestClient restClient;

    private final ObjectMapper mapper = new ObjectMapper();

    public void setConfig() throws UnknownHostException {
        String backendIp = InetAddress.getLocalHost().getHostAddress();
        log.info("[DEBUG] IP do backend detectado: {}", backendIp);

        for (String ip : ips) {
            log.info("[DEBUG] ===== Configurando dispositivo {} =====", ip);

            try {
                // ---------- LOGIN ----------
                String loginJson = mapper.writeValueAsString(new LoginRequest(login, senha));
                String loginUrl = "http://" + ip + "/login.fcgi";
                log.info("[DEBUG] POST {} | body: {}", loginUrl, loginJson.replaceAll("\"password\"\\s*:\\s*\"[^\"]*\"", "\"password\":\"***\""));

                LoginResponse loginResponse = restClient.post()
                        .uri(loginUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .body(loginJson)
                        .retrieve()
                        .body(LoginResponse.class);

                if (loginResponse == null || loginResponse.session() == null) {
                    log.error("[DEBUG] Login sem sessão retornada para {}", ip);
                    continue;
                }
                log.info("[DEBUG] Sessão obtida: {}", loginResponse.session());

                // ---------- SET CONFIGURATION ----------
                MonitorRequest monitor = new MonitorRequest("5000", backendIp, port, "post/logControlID");
                SetConfigRequest configRequest = new SetConfigRequest(monitor);

                // Serializa manualmente para ver EXATAMENTE o que será enviado
                String configJson = mapper.writeValueAsString(configRequest);
                String configUrl = "http://" + ip + "/set_configuration.fcgi?session=" + loginResponse.session();

                log.info("[DEBUG] POST {}", configUrl);
                log.info("[DEBUG] Body enviado: {}", configJson);

                String response = restClient.post()
                        .uri(configUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .body(configJson) // envia a String, garantindo que é o mesmo JSON logado
                        .retrieve()
                        .body(String.class);

                log.info("[DEBUG] Resposta set_configuration ({}): {}", ip, response);

            } catch (RestClientResponseException e) {
                // Erros HTTP 4xx/5xx: mostra status e corpo retornado pelo dispositivo
                log.error("[DEBUG] Erro HTTP em {} -> status: {} | body: {}",
                        ip, e.getStatusCode(), e.getResponseBodyAsString());
            } catch (Exception e) {
                log.error("[DEBUG] Falha ao configurar {}: {}", ip, e.getMessage(), e);
            }
        }
    }
}