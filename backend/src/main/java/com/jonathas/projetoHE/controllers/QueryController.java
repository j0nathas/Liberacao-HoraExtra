package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.query.PeriodoSolicitacoesDTO;
import com.jonathas.projetoHE.dto.query.SolicitacaoDTO;
import com.jonathas.projetoHE.dto.query.mapper.SolicitacaoMapper;
import com.jonathas.projetoHE.dto.zapsign.DocInfoResponseDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import com.jonathas.projetoHE.services.TextUtils;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import static com.jonathas.projetoHE.services.TextUtils.escapeCsv;
import static com.jonathas.projetoHE.services.TextUtils.formatarHora;

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
    private SolicitacoesRepository solicitacoesRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private RespHeRepository respHeRepository;

    @Autowired
    private SolicitacaoFuncionariosRepository  solicitacaoFuncionariosRepository;

    @Autowired
    private PlantasRepository plantasRepository;

    @Autowired
    private TipoSolicitacaoRepository tipoSolicitacaoRepository;

    private final ZapSignService zapSignService;

    @Autowired
    private SolicitacaoMapper solicitacaoMapper;

    @GetMapping("/plantas")
    public ResponseEntity<List<Plantas>> listarPlantas() {
        return ResponseEntity.ok(plantasRepository.findAll());
    }

    @GetMapping("/nomeCC")
    public ResponseEntity<String> AcharCentroCusto(@RequestParam(name = "codCC") String codCC) {
        return departamentoRepository.findByCodCentroCusto(codCC)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/motivosMacro")
    public ResponseEntity<List<MotivosMacro>> listarMotivos() {
        return ResponseEntity.ok(motivosMacroRepository.findAll());
    }

    @GetMapping("/departamentos")
    public ResponseEntity<List<DeptResp>> listarDepartamentos(@RequestParam(name = "planta") String planta) {
        return ResponseEntity.ok(departamentoRepository.listarDepartamentos(planta));
    }

    @GetMapping("/tipoSolicitacoes")
    public ResponseEntity<List<TipoSolicitacao>> listarTipos() {
        return ResponseEntity.ok(tipoSolicitacaoRepository.findAll());
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
    public ResponseEntity<List<SolicitacaoDTO>> solicitacoesPorUsuario(Authentication authentication) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        List<Solicitacao> entidades = solicitacaoRepository.findAllByUsuarioIdAndStatusNotOrderByIdDesc(usuario.getId(), "deleted");

        List<SolicitacaoDTO> dtos = entidades.stream()
                .map(solicitacaoMapper::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/infoDocZapSign")
    public ResponseEntity<DocInfoResponseDTO> infoDocZapsign(
            @RequestParam(name = "token") String tokenDoc
    ) {
        return ResponseEntity.ok(
                zapSignService.infoDocumento(tokenDoc)
        );
    }

//    @GetMapping(
//            value = "/exportar",
//            produces = "text/csv"
//    )
//    @PreAuthorize("hasAuthority('EXTRAIR_SOLICITACOES')")
//    public ResponseEntity<byte[]> exportarCSV(
//            @RequestParam LocalDate inicio,
//            @RequestParam LocalDate fim
//    ) {
//
//        if (inicio.isAfter(fim)) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        PeriodoSolicitacoesProjection periodo =
//                solicitacoesRepository.buscarPeriodoSolicitacoes();
//
//        if (inicio.isBefore(periodo.getDataMinima())
//                || fim.isAfter(periodo.getDataMaxima())) {
//
//            return ResponseEntity.badRequest().build();
//        }
//
//        List<SolicitacaoExportProjection> dados =
//                solicitacaoFuncionariosRepository
//                        .buscarSolicitacoesParaExportacao(inicio, fim);
//
//        StringBuilder csv = new StringBuilder();
//
//
//        csv.append('\uFEFF');
//
//        csv.append("Data;Departamento;Empresa;Local da Hora Extra;")
//                .append("CHAPA;NOME;Turno;Hora Início;Hora Término;")
//                .append("Tempo Gasto total;Motivo Macro;Justificativa;")
//                .append("Transporte;Autorizado?\n");
//
//        for (SolicitacaoExportProjection item : dados) {
//
//            csv.append(escapeCsv(item.getData())).append(";")
//                    .append(escapeCsv(item.getDepartamento())).append(";")
//                    .append(escapeCsv(item.getEmpresa())).append(";")
//                    .append(escapeCsv(item.getLocalDaHoraExtra())).append(";")
//                    .append(escapeCsv(item.getChapa())).append(";")
//                    .append(escapeCsv(item.getNome())).append(";")
//                    .append(escapeCsv(item.getTurno())).append(";")
//                    .append(escapeCsv(formatarHora(item.getHoraInicio()))).append(";")
//                    .append(escapeCsv(formatarHora(item.getHoraTermino()))).append(";")
//                    .append(escapeCsv(item.getTempoGastoTotal())).append(";")
//                    .append(escapeCsv(item.getMotivoMacro())).append(";")
//                    .append(escapeCsv(item.getJustificativa())).append(";")
//                    .append(escapeCsv(item.getTransporte())).append(";")
//                    .append(escapeCsv(item.getAutorizado())).append("\n");
//        }
//
//        byte[] arquivo = csv
//                .toString()
//                .getBytes(StandardCharsets.UTF_8);
//
//        return ResponseEntity.ok()
//                .header(
//                        HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"solicitacoes.csv\""
//                )
//                .contentType(
//                        MediaType.parseMediaType(
//                                "text/csv; charset=UTF-8"
//                        )
//                )
//                .body(arquivo);
//    }

//    @GetMapping("/periodo")
//    @PreAuthorize("hasAuthority('EXTRAIR_SOLICITACOES')")
//    public ResponseEntity<PeriodoSolicitacoesDTO> buscarPeriodo() {
//
//        PeriodoSolicitacoesProjection periodo =
//                solicitacoesRepository.buscarPeriodoSolicitacoes();
//
//        return ResponseEntity.ok(
//                new PeriodoSolicitacoesDTO(
//                        periodo.getDataMinima(),
//                        periodo.getDataMaxima()
//                )
//        );
//    }

}
