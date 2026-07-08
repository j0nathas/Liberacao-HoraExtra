package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.model.MotivosMacro;
import com.jonathas.projetoHE.repositories.MotivosMacroRepository;
import com.jonathas.projetoHE.repositories.RespHeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/query")
@RequiredArgsConstructor
public class QueryController {
    @Autowired
    private MotivosMacroRepository motivosMacroRepository;

    @GetMapping("/motivosMacro")
    public ResponseEntity<List<MotivosMacro>> listarMotivos() {
        return ResponseEntity.ok(motivosMacroRepository.findAll());
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<MotivosMacro>> listarMotivos() {
        return ResponseEntity.ok(motivosMacroRepository.findAll());
    }
}
