package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.services.IDLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class IDLogController {

    private final IDLogService sse;

    @GetMapping(value = "/passagens/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return sse.registrar();
    }
}