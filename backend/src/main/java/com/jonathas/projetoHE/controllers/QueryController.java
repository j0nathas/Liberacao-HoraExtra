package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import com.jonathas.projetoHE.services.TextUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/query")
@RequiredArgsConstructor
public class QueryController {
    @Autowired
    private MotivosMacroRepository motivosMacroRepository;

    @Autowired
    private FuncionariosRepository funcionariosRepository;

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private RespHeRepository respHeRepository;

    @GetMapping("/motivosMacro")
    public ResponseEntity<List<MotivosMacro>> listarMotivos() {
        return ResponseEntity.ok(motivosMacroRepository.findAll());
    }

    @GetMapping("/departamentos")
    public ResponseEntity<List<String>> listarDepartamentos(@RequestParam(name = "planta") String planta) {
        return ResponseEntity.ok(departamentoRepository.listarDepartamentos(planta));
    }

    @GetMapping("/maquinasPorDepartamento")
    public ResponseEntity<List<listaMaquinas>> listarMaquinasPorDepartamento(@RequestParam(name = "selecao") String selecao, @RequestParam(name = "planta") String planta) {
        return ResponseEntity.ok(departamentoRepository.maquinasPorDepartamento(selecao, planta));
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<Funcionarios>> funcionarios(@RequestParam(name = "pesquisa", required = false) String pesquisa, @RequestParam(name = "planta") String planta) {
        System.out.println(planta);
        if (pesquisa == null || pesquisa.trim().isEmpty()) {
            return ResponseEntity.ok(funcionariosRepository.findTop20ByOrderByNameAsc());
        }

        String termoParaBusca = TextUtils.formatarParaLike(pesquisa);

        String codEmpresa = "MLB".equals(planta) ? "710" : "720";

        List<Funcionarios> resultados = funcionariosRepository.pesquisarComFiltro(
                termoParaBusca,
                codEmpresa,
                org.springframework.data.domain.PageRequest.of(0, 20)
        );

        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/solicitacoes")
    public ResponseEntity<List<Solicitacoes>> solicitacoesPorUsuario(Authentication authentication) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return ResponseEntity.ok(solicitacaoRepository.findAllByUsuarioIdOrderByIdDesc(usuario.getId()));
    }
/*
    @GetMapping("/solicitacoes/info")
    public ResponseEntity<List<Solicitacoes>> solicitacoesInfo(int id) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return ResponseEntity.ok(solicitacaoRepository.findAllByUsuarioId(usuario.getId()));
    } */
}
