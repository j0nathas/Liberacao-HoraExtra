package com.jonathas.projetoHE.services; // Alterado para pacote de service

import com.jonathas.projetoHE.dto.zapsign.SignedBodyDTO;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CorpoEmailService {

    public String construirCorpoEmail(SignedBodyDTO dto, Solicitacoes solicitacao, List<SolicitacoesFuncionarios> funcionarios) {

        int totalPessoas = funcionarios.size();

        String horasTotais = TextUtils.calcularTempoDecorrido(solicitacao.getInicio(), solicitacao.getFim(), totalPessoas);

        return """
                <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                        <h2 style="color: #2e6c80; text-align: center;">✅⏰ Hora Extra Assinada! ⏰✅</h2>
                        
                        <p>Olá,</p>
                        <p>Um documento de hora extra foi aprovado e já está disponível!</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e6c80; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Departamento:</strong> %s</p>
                            <p style="margin: 5px 0;"><strong> 🟢 Início:</strong> %s | <strong> 🔴 Fim:</strong> %s</p>
                            <p style="margin: 5px 0;"><strong>Total de Pessoas:</strong> %d</p>
                            <p style="margin: 5px 0;"><strong>Horas Previstas:</strong> %s</p>
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
                solicitacao.getDepartamento(),
                solicitacao.getInicio(),
                solicitacao.getFim(),
                totalPessoas,                  // 2º %d (mudei para decimal)
                horasTotais,                   // 3º %s
                dto.name(),                    // 4º %s
                dto.signed_file(),             // 5º %s (Link do botão)
                dto.signed_file()              // 6º %s (Link texto)
        );
    }
}