package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.controlid.model.Devices;
import com.jonathas.projetoHE.controlid.repositories.DevicesRepository;
import com.jonathas.projetoHE.dto.post.IDLogDTO;
import com.jonathas.projetoHE.dto.post.PassagemPayloadDTO;
import com.jonathas.projetoHE.dto.query.FuncPortariaDTO;
import com.jonathas.projetoHE.model.DevicesLIberacao;
import com.jonathas.projetoHE.model.LogsLiberacao;
import com.jonathas.projetoHE.repositories.DevicesLiberacaoRepository;
import com.jonathas.projetoHE.repositories.FuncionariosRepository;
import com.jonathas.projetoHE.repositories.LogsLiberacaoRepository;
import com.jonathas.projetoHE.repositories.SolicitacoesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static java.sql.Types.NULL;

@Slf4j
@Service
@RequiredArgsConstructor
public class IDLogService {

    private final LogsLiberacaoRepository logsLiberacaoRepository;

    private final FuncionariosRepository funcionariosRepository;

    private final SolicitacoesRepository solicitacoesRepository;

    private final DevicesRepository devicesRepository;

    private final DevicesLiberacaoRepository  devicesLiberacaoRepository;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter registrar() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));
        return emitter;
    }

    public void enviar(IDLogDTO evento) {

        DevicesLIberacao deviceLiberacao = devicesLiberacaoRepository.findByDeviceId(evento.deviceId());

        Devices device = devicesRepository.findBySerial(deviceLiberacao.getSerial());

        FuncPortariaDTO funcionario = funcionariosRepository.buscarFuncionarioNaLista(evento.hora(), evento.matricula());

        System.out.println(funcionario.id());

        if(evento.matricula() == null || funcionario.id() == null){
            LogsLiberacao logsLiberacao = new LogsLiberacao();
            logsLiberacao.setId_device(device.getId());
            logsLiberacao.setId_log(evento.logId());
            logsLiberacao.setId_user(evento.userId());
            logsLiberacao.setId_funcionario(null);
            logsLiberacao.setId_solicitacoes(null);
            logsLiberacao.setId_logs_liberacao_eventos(3);
            logsLiberacao.setData_liberacao(evento.hora());
            LogsLiberacao salvarLogsLiberacao = logsLiberacaoRepository.save(logsLiberacao);


            PassagemPayloadDTO passagemDTO = new PassagemPayloadDTO(
                    evento.hora(),
                    evento.matricula(),
                    evento.nome(),
                    NULL,
                    NULL
            );

            SseEmitterSend(passagemDTO);
            return;
        }



        if (funcionario.id_log() == null &&
            funcionario.id_sol() != null &&
                funcionario.id_sol() > 0
        ) {
            LogsLiberacao logsLiberacao = new LogsLiberacao();
            logsLiberacao.setId_device(device.getId());
            logsLiberacao.setId_log(evento.logId());
            logsLiberacao.setId_user(evento.userId());
            logsLiberacao.setId_funcionario(funcionario.id());
            logsLiberacao.setId_solicitacoes(funcionario.id_sol());
            logsLiberacao.setId_logs_liberacao_eventos(1);
            logsLiberacao.setData_liberacao(evento.hora());
            LogsLiberacao salvarLogsLiberacao = logsLiberacaoRepository.save(logsLiberacao);
        } else if(funcionario.id_log() == null && funcionario.id_sol() == null) {
            LogsLiberacao logsLiberacao = new LogsLiberacao();
            logsLiberacao.setId_device(device.getId());
            logsLiberacao.setId_log(evento.logId());
            logsLiberacao.setId_user(evento.userId());
            logsLiberacao.setId_funcionario(funcionario.id());
            logsLiberacao.setId_solicitacoes(funcionario.id_sol());
            logsLiberacao.setId_logs_liberacao_eventos(2);
            logsLiberacao.setData_liberacao(evento.hora());
            LogsLiberacao salvarLogsLiberacao = logsLiberacaoRepository.save(logsLiberacao);
        } else {
            return;
        }

        PassagemPayloadDTO passagemDTO = new PassagemPayloadDTO(
                evento.hora(),
                funcionario.re(),
                funcionario.nome(),
                funcionario.id(),
                funcionario.id_sol()
        );

        SseEmitterSend(passagemDTO);
    }

    public void SseEmitterSend(PassagemPayloadDTO passagemDTO) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("passagem").data(passagemDTO));
            } catch (Exception e) {
                emitters.remove(emitter);
                log.debug("Emitter SSE removido (cliente desconectou): {}", e.getMessage());
            }
        }
    }
}