package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.RhContagemEmailDTO;
import com.jonathas.projetoHE.dto.query.QuantidadePessoasDTO;
import com.jonathas.projetoHE.dto.query.QuantidadePessoasProjecaoDTO;
import com.jonathas.projetoHE.dto.query.QntdePStatusDTO;   // ajuste o pacote se seus records estiverem em outro lugar
import com.jonathas.projetoHE.dto.query.QntdePTurnosDTO;    // ajuste o pacote se seus records estiverem em outro lugar
import com.jonathas.projetoHE.dto.query.mapper.QuantidadePessoasMapper;
import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import com.jonathas.projetoHE.repositories.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.format.TextStyle;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class CorpoEmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final SolicitacaoRepository solicitacaoRepository;
    private final QuantidadePessoasMapper quantidadePessoasMapper;

    public CorpoEmailService(SolicitacaoRepository solicitacaoRepository,
                             QuantidadePessoasMapper quantidadePessoasMapper) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.quantidadePessoasMapper = quantidadePessoasMapper;
    }

    // ------------------------------------------------------------------
    // E-mail de hora extra assinada (original, sem alterações de lógica)
    // ------------------------------------------------------------------
    public String construirCorpoEmail(
            SignedBodyDTO dto,
            List<Solicitacoes> solicitacoes,
            Map<Long, List<SolicitacoesFuncionarios>> funcionariosPorSolicitacao
    ) {

        int totalPessoasGeral = 0;
        List<TextUtils.SolicitacaoDuracao> duracoes = new ArrayList<>();

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
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hora Extra Assinada</title>
        </head>

        <body style="margin:0; padding:0; background-color:#F3F5F7;
                     font-family:Arial,Helvetica,sans-serif; color:#333333;">

            <table role="presentation" width="100%%" cellpadding="0"
                   cellspacing="0" border="0"
                   style="background-color:#F3F5F7; padding:30px 12px;">
                <tr>
                    <td align="center">

                        <table role="presentation" width="100%%" cellpadding="0"
                               cellspacing="0" border="0"
                               style="max-width:600px; background-color:#FFFFFF;
                                      border:1px solid #E1E5E9; border-radius:10px;">

                            <!-- Faixa superior -->
                            <tr>
                                <td height="6"
                                    style="height:6px; background-color:#2E6C80;
                                           font-size:0; line-height:0;
                                           border-radius:10px 10px 0 0;">
                                    &nbsp;
                                </td>
                            </tr>

                            <!-- Cabeçalho com logo e título -->
                            <tr>
                                <td style="padding:24px 24px 20px 24px;
                                           border-bottom:1px solid #E9EDF0;">

                                    <table role="presentation" width="100%%"
                                           cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <!-- Logo -->
                                            <td width="100" valign="middle"
                                                style="width:100px; padding-right:18px;">
                                                <img src="cid:logoEmpresa"
                                                     alt="Logo da empresa"
                                                     width="90"
                                                     style="display:block; width:90px;
                                                            max-width:90px; height:auto;
                                                            border:0;">
                                            </td>

                                            <!-- Título -->
                                            <td valign="middle">
                                                <p style="margin:0 0 6px 0;
                                                          font-size:11px;
                                                          font-weight:bold;
                                                          letter-spacing:1px;
                                                          color:#2E6C80;
                                                          text-transform:uppercase;">
                                                    Sistema de Gestão
                                                </p>

                                                <h1 style="margin:0;
                                                           font-size:22px;
                                                           line-height:1.3;
                                                           color:#2E6C80;">
                                                    Hora Extra Assinada ✅
                                                </h1>

                                                <p style="margin:6px 0 0 0;
                                                          font-size:13px;
                                                          color:#667580;">
                                                    Documento aprovado com sucesso
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Conteúdo -->
                            <tr>
                                <td style="padding:24px;">

                                    <p style="margin:0 0 12px 0;
                                              font-size:15px;">
                                        Olá,
                                    </p>

                                    <p style="margin:0 0 22px 0;
                                              font-size:14px; line-height:1.7;
                                              color:#505A61;">
                                        Um documento de hora extra foi aprovado
                                        e já está disponível!
                                    </p>

                                    <!-- Resumo -->
                                    <table role="presentation" width="100%%"
                                           cellpadding="0" cellspacing="0" border="0"
                                           style="background-color:#EEF4F7;
                                                  border-left:4px solid #2E6C80;
                                                  border-radius:5px;">
                                        <tr>
                                            <td style="padding:16px 18px;">

                                                <p style="margin:5px 0;
                                                          font-size:14px;">
                                                    <strong>Locais:</strong> %s
                                                </p>

                                                <p style="margin:5px 0;
                                                          font-size:14px;">
                                                    <strong>Total de Pessoas:</strong> %d
                                                </p>

                                                <p style="margin:5px 0;
                                                          font-size:14px;">
                                                    <strong>Total de Horas:</strong> %s
                                                </p>

                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Departamentos -->
                                    <h2 style="margin:28px 0 14px 0;
                                               font-size:18px;
                                               color:#2E6C80;">
                                        Detalhamento por Departamento
                                    </h2>

                                    %s

                                    <!-- Documento -->
                                    <table role="presentation" width="100%%"
                                           cellpadding="0" cellspacing="0" border="0"
                                           style="margin-top:24px;">
                                        <tr>
                                            <td style="padding:16px;
                                                       background-color:#F7F9FA;
                                                       border:1px solid #E5E9EC;
                                                       border-radius:6px;">

                                                <p style="margin:0 0 16px 0;
                                                          font-size:14px;
                                                          word-break:break-word;">
                                                    <strong>Nome do Documento:</strong>
                                                    %s
                                                </p>

                                                <table role="presentation"
                                                       cellpadding="0" cellspacing="0"
                                                       border="0">
                                                    <tr>
                                                        <td bgcolor="#2E6C80"
                                                            style="background-color:#2E6C80;
                                                                   border-radius:5px;">
                                                            <a href="%s"
                                                               style="display:inline-block;
                                                                      padding:12px 22px;
                                                                      color:#FFFFFF;
                                                                      font-size:14px;
                                                                      font-weight:bold;
                                                                      text-decoration:none;
                                                                      border-radius:5px;">
                                                                Acessar documento
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin:18px 0 6px 0;
                                                          font-size:12px;
                                                          color:#667580;">
                                                    Se o botão não funcionar,
                                                    copie o link abaixo:
                                                </p>

                                                <p style="margin:0; font-size:12px;
                                                          line-height:1.6;
                                                          word-break:break-all;
                                                          color:#2E6C80;">
                                                    %s
                                                </p>

                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Rodapé -->
                            <tr>
                                <td align="center"
                                    style="padding:18px 24px;
                                           background-color:#F7F9FA;
                                           border-top:1px solid #E9EDF0;
                                           border-radius:0 0 10px 10px;">

                                    <p style="margin:0; font-size:12px;
                                              line-height:1.6; color:#77828A;">
                                        Este é um e-mail automático do Sistema
                                        de Gestão de Hora Extra.
                                        Por favor, não responda.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

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

    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");

    public String construirCorpoEmailRestaurante(RhContagemEmailDTO dto) {

        if (dto.datasSelecionadas() == null || dto.datasSelecionadas().isEmpty()) {
            return emailVazio("Nenhuma data foi selecionada para a consulta.");
        }

        LocalDate inicio = dto.datasSelecionadas().stream().min(Comparator.naturalOrder()).orElseThrow();
        LocalDate fim    = dto.datasSelecionadas().stream().max(Comparator.naturalOrder()).orElseThrow();

        List<QuantidadePessoasProjecaoDTO> dadosPlanos =
                solicitacaoRepository.listaQuantidadePessoasEmail(inicio, fim.plusDays(1), dto.listaStatus());

        List<QuantidadePessoasDTO> diasOrdenados =
                quantidadePessoasMapper.toDTO(dadosPlanos).stream()
                        .sorted(Comparator.comparing(QuantidadePessoasDTO::inicio))
                        .toList();

        StringBuilder conteudoDias = new StringBuilder();

        for (QuantidadePessoasDTO dia : diasOrdenados) {

            // Consolida os diferentes status para cada turno
            Map<String, Integer> porTurno = new TreeMap<>();
            for (QntdePStatusDTO status : dia.status()) {
                for (QntdePTurnosDTO turno : status.turnos()) {
                    porTurno.merge(turno.turno(), turno.quantidade_pessoas(), Integer::sum);
                }
            }

            int totalDia = porTurno.values().stream().mapToInt(Integer::intValue).sum();
            conteudoDias.append(montarBlocoDia(LocalDate.from(dia.inicio()), porTurno, totalDia));
        }

        String corpo = diasOrdenados.isEmpty()
                ? """
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" bgcolor="#F7F5F0"
                        style="background-color:#F7F5F0;border-radius:12px;padding:28px 20px;font-size:14px;color:#6B6558;">
                  Nenhuma solicitação encontrada para o período e os status informados.
                </td></tr>
              </table>
              """
                : conteudoDias.toString();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String periodo = inicio.equals(fim)
                ? inicio.format(fmt)
                : inicio.format(fmt) + " a " + fim.format(fmt);

        return """
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <title>Previsão de Refeições – Hora Extra</title>
        </head>
        <body style="margin:0;padding:0;background-color:#ECEBE6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#2B2A26;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ECEBE6" style="background-color:#ECEBE6;">
            <tr><td align="center" style="padding:28px 12px;">
 
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"
                     style="max-width:600px;background-color:#FFFFFF;border-radius:16px;">
 
                <!-- Faixa de cor -->
                <tr>
                  <td height="6" bgcolor="#E8833A"
                      style="background-color:#E8833A;height:6px;font-size:0;line-height:0;border-radius:16px 16px 0 0;">&nbsp;</td>
                </tr>
                
 
                <!-- Título -->
                        <tr>
                            <td style="padding: 30px 32px 6px 32px;">
                                <table role="presentation"
                                       width="100%"
                                       cellpadding="0"
                                       cellspacing="0"
                                       border="0">
                                    <tr>
                                        <!-- Logo -->
                                        <td width="50"
                                            valign="middle"
                                            style="width:70px; padding-right:15px;">
                                            <img src="cid:logoEmpresa"
                                                 alt="Logo da empresa"
                                                 width="50"
                                                 style="display:block; width:60px; height:auto; border:0;">
                                        </td>
                
                                        <!-- Texto -->
                                        <td valign="middle">
                                            <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;color:#E8833A;text-transform:uppercase;">
                                                Hora extra &bull; Restaurante
                                            </div>
                
                                            <h1 style="margin:8px 0 10px 0;font-size:27px;line-height:1.2;font-weight:700;color:#1B3D32;">
                                                Previsão de Refeições
                                            </h1>
                
                                            <p style="margin:0;font-size:14px;line-height:1.6;color:#6B6558;">
                                                Olá! Segue a quantidade de pessoas por turno, conforme as solicitações de hora extra de
                                                <strong style="color:#2B2A26;">{{periodo}}</strong>.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                <!-- Dias -->
                <tr>
                  <td style="padding:22px 32px 6px 32px;">
                    {{dias}}
                  </td>
                </tr> 
                <!-- Rodapé -->
                <tr>
                  <td align="center" bgcolor="#1B3D32"
                      style="background-color:#1B3D32;padding:18px 32px;border-radius:0 0 16px 16px;">
                    <p style="margin:0;font-size:11px;line-height:1.6;color:#A9C4B9;">
                      Mensagem automática &bull; Sistema de Gestão de Hora Extra
                    </p>
                  </td>
                </tr>
 
              </table>
            </td></tr>
          </table>
        </body>
        </html>
        """
                .replace("{{periodo}}", periodo)
                .replace("{{dias}}", corpo);
    }

    /** Um dia: bloco de data à esquerda, turnos à direita. */
    private String montarBlocoDia(LocalDate data, Map<String, Integer> porTurno, int totalDia) {

        String diaSemana = data.getDayOfWeek().getDisplayName(TextStyle.FULL, PT_BR);
        diaSemana = Character.toUpperCase(diaSemana.charAt(0)) + diaSemana.substring(1);
        String mes = data.getMonth().getDisplayName(TextStyle.SHORT, PT_BR)
                .replace(".", "").toUpperCase(PT_BR);

        StringBuilder linhas = new StringBuilder();

        if (porTurno.isEmpty()) {
            linhas.append("""
            <tr><td style="padding:10px 0;font-size:13px;color:#8A8577;">
              Nenhum dado disponível para este dia.
            </td></tr>
            """);
        } else {
            for (Map.Entry<String, Integer> e : porTurno.entrySet()) {
                linhas.append("""
                <tr>
                  <td style="padding:7px 0;font-size:14px;color:#2B2A26;">
                    {{turno}}
                  </td>
                  <td align="right" style="padding:7px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" align="right">
                      <tr>
                        <td align="center" bgcolor="#E6F1EC" width="52"
                            style="background-color:#E6F1EC;border-radius:20px;padding:5px 0;
                                   font-size:15px;font-weight:700;color:#1B3D32;">
                          {{qtd}}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                """
                        .replace("{{turno}}", escaparHtml(e.getKey()))
                        .replace("{{qtd}}", String.valueOf(e.getValue())));
            }
        }

        return """
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="margin:0 0 14px 0;border:1px solid #E6E3DA;border-radius:12px;border-collapse:separate;">
          <tr>
            <!-- Data -->
            <td width="88" valign="top" align="center" bgcolor="#F7F5F0"
                style="background-color:#F7F5F0;padding:18px 8px;border-radius:12px 0 0 12px;border-right:1px solid #E6E3DA;">
              <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;color:#E8833A;">{{mes}}</div>
              <div style="font-size:34px;font-weight:700;line-height:1.1;color:#1B3D32;margin:2px 0;">{{dia}}</div>
              <div style="font-size:11px;color:#8A8577;">{{ano}}</div>
            </td>
            <!-- Turnos -->
            <td valign="top" style="padding:16px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td colspan="2" style="padding-bottom:6px;border-bottom:1px solid #EFECE4;
                                         font-size:15px;font-weight:700;color:#1B3D32;">
                    {{diaSemana}}
                    <span style="font-size:12px;font-weight:400;color:#8A8577;">&nbsp;&bull;&nbsp;{{total}} no dia</span>
                  </td>
                </tr>
                {{linhas}}
              </table>
            </td>
          </tr>
        </table>
        """
                .replace("{{mes}}", mes)
                .replace("{{dia}}", String.format("%02d", data.getDayOfMonth()))
                .replace("{{ano}}", String.valueOf(data.getYear()))
                .replace("{{diaSemana}}", escaparHtml(diaSemana))
                .replace("{{total}}", String.valueOf(totalDia))
                .replace("{{linhas}}", linhas.toString());
    }

    private String emailVazio(String mensagem) {
        return """
        <!DOCTYPE html>
        <html lang="pt-BR">
        <body style="margin:0;padding:28px 12px;background-color:#ECEBE6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"
                 style="max-width:520px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;">
            <tr><td height="6" bgcolor="#E8833A" style="background-color:#E8833A;font-size:0;line-height:0;border-radius:16px 16px 0 0;">&nbsp;</td></tr>
            <tr><td align="center" style="padding:30px 28px;">
              <h2 style="margin:0 0 8px 0;font-size:20px;color:#1B3D32;">Previsão de Refeições – Hora Extra</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6B6558;">{{msg}}</p>
            </td></tr>
          </table>
        </body>
        </html>
        """.replace("{{msg}}", escaparHtml(mensagem));
    }

    private String escaparHtml(String valor) {
        if (valor == null) {
            return "";
        }

        return valor
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}