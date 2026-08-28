package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CorpoEmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public String construirCorpoEmail(
            SignedBodyDTO dto,
            List<Solicitacoes> solicitacoes,
            Map<Long, List<SolicitacoesFuncionarios>> funcionariosPorSolicitacao
    ) {

        int totalPessoasGeral = 0;
        List<TextUtils.SolicitacaoDuracao> duracoes = new java.util.ArrayList<>();

        for (Solicitacoes s : solicitacoes) {
            int qtd = funcionariosPorSolicitacao.getOrDefault(s.getId(), List.of()).size();
            totalPessoasGeral += qtd;
            duracoes.add(new TextUtils.SolicitacaoDuracao(
                    s.getInicio().toLocalDateTime(),
                    s.getFim().toLocalDateTime(),
                    qtd
            ));
        }

        String horasTotaisGeral = TextUtils.calcularTempoTotal(duracoes);

        String listaDepartamentos = solicitacoes.stream()
                .map(Solicitacoes::getDepartamento)
                .filter(Objects::nonNull)
                .map(DeptResp::getDepartamento)
                .distinct()
                .collect(Collectors.joining(", "));

        StringBuilder blocosDepartamentos = new StringBuilder();

        for (Solicitacoes s : solicitacoes) {
            int qtd = funcionariosPorSolicitacao.getOrDefault(s.getId(), List.of()).size();

            String horasDepartamento = TextUtils.calcularTempoTotal(
                    List.of(new TextUtils.SolicitacaoDuracao(
                            s.getInicio().toLocalDateTime(),
                            s.getFim().toLocalDateTime(),
                            qtd
                    ))
            );

            blocosDepartamentos.append("""
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e6c80; margin: 15px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Departamento:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong>Turno:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong> 🟢 Início:</strong> %s | <strong> 🔴 Fim:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong>Total de Pessoas:</strong> %d</p>
                        <p style="margin: 5px 0;"><strong>Horas Previstas:</strong> %s</p>
                    </div>
                    """.formatted(
                    s.getDepartamento().getDepartamento(),
                    s.getTurno().getTurno(),
                    s.getInicio().toLocalDateTime(),
                    s.getFim().toLocalDateTime(),
                    qtd,
                    horasDepartamento
            ));
        }

        String urlAssinatura = "http://" + frontendUrl + "/zapsign/" + dto.token();

        return """
                <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                        <h2 style="color: #2e6c80; text-align: center;">✅⏰ Hora Extra Assinada! ⏰✅</h2>
                        
                        <p>Olá,</p>
                        <p>Um documento de hora extra foi aprovado e já está disponível!</p>
                        
                        <div style="background-color: #eef4f7; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 5px 0;"><strong>Locais:</strong> %s</p>
                            <p style="margin: 5px 0;"><strong>Total de Pessoas:</strong> %d</p>
                            <p style="margin: 5px 0;"><strong>Total de Horas:</strong> %s</p>
                        </div>

                        <h3 style="color: #2e6c80; margin-top: 25px;">Detalhamento por Departamento</h3>
                        %s

                        <div style="margin: 20px 0;">
                            <p style="margin: 8px 0;"><strong>Nome do Documento:</strong> %s</p>
                            <br>
                             <a style="padding: 10px 20px; background-color: #007bff; border-radius: 5px; 
                             color: #FFFFFF; font-weight: bold; text-decoration: none; display: inline-block;" 
                             href="%s">Clique aqui para baixar</a>
                        </div>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="font-size: 12px;">Caso o botão não funcione, copie o link:</p>
                            <p style="font-size: 12px; word-break: break-all;">%s</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #777;">Este é um e-mail automático do sistema. Por favor, não responda.</p>
                    </div>
                </body>
                </html>
                """.formatted(
                listaDepartamentos,
                totalPessoasGeral,
                horasTotaisGeral,
                blocosDepartamentos.toString(),
                dto.name(),
                urlAssinatura,
                urlAssinatura
        );
    }
}