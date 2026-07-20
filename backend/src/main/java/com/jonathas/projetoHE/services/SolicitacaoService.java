package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.SolicitacaoDTO;
import com.jonathas.projetoHE.dto.post.SolicitacaoFuncionarioDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentDTO;
import com.jonathas.projetoHE.dto.zapsign.DocumentResponseDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.jonathas.projetoHE.services.ZapSignService;


@Slf4j
@Service
@RequiredArgsConstructor
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final RespHeRepository respHeRepository;
    private final MotivosMacroRepository motivosMacroRepository;
    private final FuncionariosRepository funcionariosRepository;
    private final SolicitacaoFuncionariosRepository solicitacoesFuncionariosRepository;
    private final RequestLockService requestLockService;
    private final ZapSignService zapSignService;
    private final SentEmailService sentEmailService;

    @Transactional
    public Solicitacoes salvar(SolicitacaoDTO dto){

        if (!requestLockService.adquirir((long) dto.id_user())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma solicitação sendo processada."
            );
        }

        try{

            RespHE usuario = respHeRepository.findById(dto.id_user())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            MotivosMacro motivo = motivosMacroRepository.findById((long) dto.id_motivo_macro())
                    .orElseThrow(() -> new RuntimeException("Motivo não encontrado"));

            Solicitacoes solicitacao = new Solicitacoes();

            solicitacao.setUsuario(usuario);
            solicitacao.setMotivosMacro(motivo);
            solicitacao.setMotivoDetalhado(dto.motivo_detalhado());
            solicitacao.setDepartamento(dto.departamento());
            solicitacao.setTurno(dto.turno());
            solicitacao.setInicio(dto.inicio());
            solicitacao.setFim(dto.fim());
            solicitacao.setData(dto.data());


            DocumentDTO body = new DocumentDTO(
                    dto.base64(),
                    usuario.getNome(),
                    usuario.getSobrenome(),
                    usuario.getEmail()
            );

            try {

            DocumentResponseDTO resposta = zapSignService.criarDocumento(body);

                solicitacao.setToken(resposta.token());
                solicitacao.setStatus(resposta.status());

            } catch (Exception e) {

                solicitacao.setStatus("error");
                log.error("Erro ao criar documento no ZapSign", e);

            }


            solicitacao = solicitacaoRepository.save(solicitacao);


            for (SolicitacaoFuncionarioDTO item : dto.funcionarios()) {

                Funcionarios funcionario = funcionariosRepository.findById((long) item.id_funcionario())
                        .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

                Departamento maquina = departamentoRepository
                        .findByCodMaquina(String.valueOf(item.id_maquina()))
                        .orElseThrow(() -> new RuntimeException("Máquina não encontrada"));

                SolicitacoesFuncionarios relacao = new SolicitacoesFuncionarios();

                relacao.setSolicitacoes(solicitacao);
                relacao.setFuncionarios(funcionario);
                relacao.setMaquinas(maquina);

                solicitacoesFuncionariosRepository.save(relacao);
            }

            sentEmailService.enviarEmail(
                    usuario.getEmail(),
                    "HORA EXTRA ENVIADA",
                    "Sua solicitação de hora extra foi enviada!");

            return solicitacao;
        } finally {
            requestLockService.liberar((long) dto.id_user());
        }

    }
}
