package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.SolicitacoesDTO;
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

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;


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
    private final DeptRespRepository deptRespRepository;
    private final PlantasRepository plantasRepository;

    @Transactional
    public List<Solicitacoes> salvar(SolicitacoesDTO dto) {

        if (!requestLockService.adquirir((long) dto.id_user())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma solicitação sendo processada."
            );
        }

        try {
            RespHE usuario = respHeRepository.findById(dto.id_user())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            LocalDateTime agora = LocalDateTime.now();

            for (var solicitacaoDTO : dto.solicitacoes()) {

                motivosMacroRepository.findById((long) solicitacaoDTO.id_motivo_macro())
                        .orElseThrow(() -> new RuntimeException("Motivo não encontrado"));

                if (solicitacaoDTO.inicio().isBefore(agora)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A data/hora de início não pode ser anterior ao momento atual."
                    );
                }
                if (!solicitacaoDTO.fim().isAfter(solicitacaoDTO.inicio())) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A data/hora de término deve ser posterior à data/hora de início."
                    );
                }

                for (SolicitacaoFuncionarioDTO item : solicitacaoDTO.funcionarios()) {
                    funcionariosRepository.findById((long) item.id_funcionario())
                            .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

                    departamentoRepository.findByCodMaquina(String.valueOf(item.id_maquina()))
                            .orElseThrow(() -> new RuntimeException("Máquina não encontrada"));
                }
            }


            String token = null;
            String status = "error";

            try {
                List<DeptResp> departamentos = dto.solicitacoes().stream()
                        .map(item -> deptRespRepository.findById((long) item.id_departamento())
                                .orElseThrow(() -> new RuntimeException("Departamento não encontrado")))
                        .distinct()
                        .toList();

                DocumentDTO documentDTO = new DocumentDTO(
                        dto.base64(), usuario.getNome(), usuario.getSobrenome(), usuario.getEmail(), departamentos);
                DocumentResponseDTO resposta = zapSignService.criarDocumento(documentDTO);
                token = resposta.token();
                status = resposta.status();
            } catch (Exception e) {
                log.error("Falha ao criar documento no ZapSign para o usuário {}: {}",
                        dto.id_user(), e.getMessage());
            }

            List<Solicitacoes> solicitacoesSalvas = new ArrayList<>();
            final String tokenFinal = token;
            final String statusFinal = status;

            dto.solicitacoes().forEach(solicitacaoDTO -> {

                MotivosMacro motivo = motivosMacroRepository.findById((long) solicitacaoDTO.id_motivo_macro())
                        .orElseThrow(() -> new RuntimeException("Motivo não encontrado"));

                DeptResp departamento = deptRespRepository.findById((long) solicitacaoDTO.id_departamento())
                        .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));

                Plantas planta = plantasRepository.findById(String.valueOf((int) solicitacaoDTO.id_planta())).orElseThrow(() -> new RuntimeException("Planta não encontrada"));

                Solicitacoes solicitacao = new Solicitacoes();
                solicitacao.setUsuario(usuario);
                solicitacao.setMotivosMacro(motivo);
                solicitacao.setMotivoDetalhado(solicitacaoDTO.motivo_detalhado());
                solicitacao.setPlanta(planta);
                solicitacao.setDepartamento(departamento);
                solicitacao.setTurno(solicitacaoDTO.turno());
                solicitacao.setInicio(solicitacaoDTO.inicio().atZone(ZoneId.of("America/Sao_Paulo")));
                solicitacao.setFim(solicitacaoDTO.fim().atZone(ZoneId.of("America/Sao_Paulo")));
                solicitacao.setData(agora.atZone(ZoneId.of("America/Sao_Paulo")));
                solicitacao.setToken(tokenFinal);
                solicitacao.setStatus(statusFinal);

                solicitacao = solicitacaoRepository.save(solicitacao);

                for (SolicitacaoFuncionarioDTO item : solicitacaoDTO.funcionarios()) {

                    Funcionarios funcionario = funcionariosRepository.findById((long) item.id_funcionario())
                            .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

                    Departamento maquina = departamentoRepository
                            .findByCodMaquina(String.valueOf(item.id_maquina()))
                            .orElseThrow(() -> new RuntimeException("Máquina não encontrada"));

                    SolicitacoesFuncionarios relacao = new SolicitacoesFuncionarios();
                    relacao.setSolicitacoes(solicitacao);
                    relacao.setFuncionario(funcionario);
                    relacao.setMaquina(maquina);

                    solicitacoesFuncionariosRepository.save(relacao);
                }

                solicitacoesSalvas.add(solicitacao);
            });

            return solicitacoesSalvas;

        } finally {
            requestLockService.liberar((long) dto.id_user());
        }
    }
}
