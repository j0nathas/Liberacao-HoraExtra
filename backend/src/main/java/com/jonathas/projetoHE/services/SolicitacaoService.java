package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.JustificativasDTO;
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
    private final SolicitacoesRepository solicitacoesRepository;
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
    private final TipoSolicitacaoRepository tipoSolicitacaoRepository;
    private final TurnosRepository turnosRepository;
    private final JustificativasRepository justificativasRepository;

    @Transactional
    public List<Solicitacoes> salvar(SolicitacoesDTO dto) {
        if (!requestLockService.adquirir((long) dto.id_user())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma solicitação sendo processada.");
        }

        try {
            RespHE usuario = respHeRepository.findById(dto.id_user())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

            LocalDateTime agora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

            String token = null;
            String status = "error";

            try {
                List<DeptResp> departamentos = dto.solicitacoes().stream()
                        .map(s -> deptRespRepository.findById((long) s.id_departamento())
                                .orElseThrow(() -> new RuntimeException("Depto não encontrado: " + s.id_departamento())))
                        .distinct()
                        .toList();

                DocumentDTO documentDTO = new DocumentDTO(
                        dto.base64(), usuario.getNome(), usuario.getSobrenome(), usuario.getEmail(), departamentos);
                DocumentResponseDTO resposta = zapSignService.criarDocumento(documentDTO);
                token = resposta.token();
                status = resposta.status();
            } catch (Exception e) {
                log.error("Falha ao criar documento no ZapSign para o usuário {}: {}", dto.id_user(), e.getMessage());
            }

            ZonedDateTime data = dto.data()
                    .withZoneSameInstant(ZoneId.of("America/Sao_Paulo"));

            Solicitacao solicitacaoPai = new Solicitacao();
            solicitacaoPai.setData(data);
            solicitacaoPai.setUsuario(usuario);
            solicitacaoPai.setStatus(status);
            solicitacaoPai.setToken(token);
            solicitacaoPai = solicitacaoRepository.save(solicitacaoPai);

            List<Solicitacoes> solicitacoesSalvas = new ArrayList<>();

            for (var sDto : dto.solicitacoes()) {
                if (sDto.inicio().isBefore(agora)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Início não pode ser no passado.");
                }
                if (!sDto.fim().isAfter(sDto.inicio())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fim deve ser após o início.");
                }

                MotivosMacro motivo = motivosMacroRepository.findById((long) sDto.id_motivo_macro())
                        .orElseThrow(() -> new RuntimeException("Motivo não encontrado"));
                TipoSolicitacao tipo = tipoSolicitacaoRepository.findById((long) sDto.id_tipo())
                        .orElseThrow(() -> new RuntimeException("Tipo não encontrado"));
                DeptResp depto = deptRespRepository.findById((long) sDto.id_departamento())
                        .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));
                Turnos turno = turnosRepository.findById((long) sDto.id_turno())
                        .orElseThrow(() -> new RuntimeException("Turno não encontrado"));
                Plantas planta = plantasRepository.findById(String.valueOf((int) sDto.id_planta()))
                        .orElseThrow(() -> new RuntimeException("Planta não encontrada"));

                Solicitacoes solicitacaoFilha = new Solicitacoes();
                solicitacaoFilha.setSolicitacao(solicitacaoPai);
                solicitacaoFilha.setMotivosMacro(motivo);
                solicitacaoFilha.setTipo(tipo);
                solicitacaoFilha.setDepartamento(depto);
                solicitacaoFilha.setTurno(turno);
                solicitacaoFilha.setInicio(sDto.inicio().atZone(ZoneId.of("America/Sao_Paulo")));
                solicitacaoFilha.setFim(sDto.fim().atZone(ZoneId.of("America/Sao_Paulo")));
                solicitacaoFilha.setPlanta(planta);

                final Solicitacoes solicitacaoSalva = solicitacoesRepository.save(solicitacaoFilha);

                for (JustificativasDTO jDto : sDto.justificativas()) {
                    Departamento maquina = departamentoRepository.findByCodMaquina(jDto.id_maquina())
                            .orElseThrow(() -> new RuntimeException("Máquina não encontrada: " + jDto.id_maquina()));

                    SolicitacoesJustificativas justificativa = new SolicitacoesJustificativas();
                    justificativa.setSolicitacoes(solicitacaoSalva);
                    justificativa.setJustificativa(jDto.justificativa());
                    justificativa.setMaquina(maquina);
                    justificativa = justificativasRepository.save(justificativa);

                    for (SolicitacaoFuncionarioDTO fDto : jDto.funcionarios()) {
                        Funcionarios func = funcionariosRepository.findById((long) fDto.id_funcionario())
                                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

                        SolicitacoesFuncionarios relacao = new SolicitacoesFuncionarios();
                        relacao.setJustificativa(justificativa);
                        relacao.setFuncionario(func);
                        solicitacoesFuncionariosRepository.save(relacao);
                    }
                }
                solicitacoesSalvas.add(solicitacaoSalva);
            }

            return solicitacoesSalvas;

        } finally {
            requestLockService.liberar((long) dto.id_user());
        }
    }
}
