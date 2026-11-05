package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.IDLogDTO;
import com.jonathas.projetoHE.model.LogsLiberacao;
import com.jonathas.projetoHE.repositories.LogsLiberacaoRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class IDLogService {

    @Autowired
    private final LogsLiberacaoRepository logsLiberacaoRepository;

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
        System.out.println(evento);

        for (SseEmitter emitter : emitters) {
            try {

                ZonedDateTime liberacao = ZonedDateTime.from(evento.hora().minus(20, ChronoUnit.HOURS));
                logsLiberacaoRepository.acharUltimoRegistroRecente(liberacao, )
                LogsLiberacao logsLiberacao = new LogsLiberacao();


                emitter.send(SseEmitter.event().name("passagem").data(evento));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}