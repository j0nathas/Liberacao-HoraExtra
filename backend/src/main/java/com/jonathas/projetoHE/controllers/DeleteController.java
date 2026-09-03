package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.zapsign.DocInfoResponseDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/delete")
@RequiredArgsConstructor
public class DeleteController {
    private final ZapSignService zapSignService;


    @DeleteMapping("/deletarDoc")
    public ResponseEntity<DocInfoResponseDTO> deletarDoc(
            @RequestParam(name = "token") String tokenDoc
    ) {

        return ResponseEntity.ok(
                zapSignService.deletarDocumento(tokenDoc)
        );
    }

}
