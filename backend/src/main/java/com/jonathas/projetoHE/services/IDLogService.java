package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.IDLogDTO;
import com.jonathas.projetoHE.model.LogsLiberacao;
import com.jonathas.projetoHE.repositories.LogsLiberacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class IDLogService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

        private LogsLiberacaoRepository logsLiberacaoRepository;

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
                LogsLiberacao logsLiberacao = new LogsLiberacao();


                emitter.send(SseEmitter.event().name("passagem").data(evento));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}