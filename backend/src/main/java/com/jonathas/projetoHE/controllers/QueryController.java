package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.model.Funcionarios;
import com.jonathas.projetoHE.model.MotivosMacro;
import com.jonathas.projetoHE.model.listaMaquinas;
import com.jonathas.projetoHE.repositories.DepartamentoRepository;
import com.jonathas.projetoHE.repositories.FuncionariosRepository;
import com.jonathas.projetoHE.repositories.MotivosMacroRepository;
import com.jonathas.projetoHE.services.TextUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/motivosMacro")
    public ResponseEntity<List<MotivosMacro>> listarMotivos() {
        return ResponseEntity.ok(motivosMacroRepository.findAll());
    }

    @GetMapping("/departamentos")
    public ResponseEntity<List<String>> listarDepartamentos() {
        return ResponseEntity.ok(departamentoRepository.listarDepartamentos());
    }

    @GetMapping("/maquinasPorDepartamento")
    public ResponseEntity<List<listaMaquinas>> listarMaquinasPorDepartamento(@RequestParam(name = "selecao") String selecao) {
        return ResponseEntity.ok(departamentoRepository.maquinasPorDepartamento(selecao));
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<Funcionarios>> funcionarios(@RequestParam(name = "pesquisa", required = false) String pesquisa) {
        if (pesquisa == null || pesquisa.trim().isEmpty()) {
            return ResponseEntity.ok(funcionariosRepository.findTop20ByOrderByNameAsc());
        }

        String termoParaBusca = TextUtils.formatarParaLike(pesquisa);

        List<Funcionarios> resultados = funcionariosRepository.pesquisarComFiltro(
                termoParaBusca,
                org.springframework.data.domain.PageRequest.of(0, 20)
        );

        return ResponseEntity.ok(resultados);
    }
}
