package com.jonathas.projetoHE.controllers;

import com.jonathas.projetoHE.dto.query.*;
import com.jonathas.projetoHE.dto.query.ListLobby.DatesDTO;
import com.jonathas.projetoHE.dto.query.ListLobby.QueryDTO;
import com.jonathas.projetoHE.dto.query.ListLobby.mapper.ListLobbyMapper;
import com.jonathas.projetoHE.dto.query.mapper.HomeMapper;
import com.jonathas.projetoHE.dto.query.mapper.QuantidadePessoasMapper;
import com.jonathas.projetoHE.dto.query.mapper.SolicitacaoMapper;
import com.jonathas.projetoHE.dto.zapsign.DocInfoResponseDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import com.jonathas.projetoHE.services.TextUtils;
import com.jonathas.projetoHE.services.ZapSignService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @Autowired HomeMapper homeMapper;

    @Autowired
    private QuantidadePessoasMapper quantidadePessoasMapper;

    @Autowired
    private ListLobbyMapper listLobbyMapper;

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
    public ResponseEntity<List<Funcionarios>> funcionarios(
            @RequestParam(name = "pesquisa", required = false) String pesquisa,
            @RequestParam(name = "planta") String planta) {

        System.out.println(planta);

        if (pesquisa == null || pesquisa.trim().isEmpty()) {
            return ResponseEntity.ok(funcionariosRepository.findTop20ByOrderByNameAsc());
        }

        String termoParaBusca = TextUtils.formatarParaLike(pesquisa);

        List<String> codEmpresas = "MLB".equals(planta)
                ? List.of("710", "702")
                : List.of("720");

        List<Funcionarios> resultados = funcionariosRepository.pesquisarComFiltro(
                termoParaBusca,
                codEmpresas,
                PageRequest.of(0, 20)
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

    @GetMapping("/homeInfo")
    public ResponseEntity<List<HomeInfoDTO>> infoHome(Authentication authentication) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        List<Solicitacao> entidades = solicitacaoRepository.findAllParaAcompanhamento(usuario.getId(), "deleted", PageRequest.of(0, 3));

        List<HomeInfoDTO> dtos = entidades.stream()
                .map(homeMapper::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/homeCount")
    public ResponseEntity<List<HomeCountDTO>> countHome(Authentication authentication) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        List<HomeCountDTO> dtos = solicitacaoRepository.homeCount(usuario.getId());

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

    @GetMapping("/todasSolicitacoes")
    @PreAuthorize("hasAuthority('VISUALIZAR_TODAS_SOLICITACOES')")
    public ResponseEntity<List<SolicitacaoDTO>> TodasSolicitacoes(Authentication authentication) {
        String login = authentication.getName();

        RespHE usuario = respHeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        List<Solicitacao> entidades = solicitacaoRepository.findAllByStatusNotOrderByIdDesc("deleted");

        List<SolicitacaoDTO> dtos = entidades.stream()
                .map(solicitacaoMapper::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/quantidadePessoas")
    @PreAuthorize("hasAuthority('ENVIAR_EMAIL_RESTAURANTE')")
    public ResponseEntity<List<QuantidadePessoasDTO>> QuantidadePessoas() {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(8);

        List<QuantidadePessoasProjecaoDTO> dadosPlanos = solicitacaoRepository.listaQuantidadePessoas(hoje, limite);


        return ResponseEntity.ok(quantidadePessoasMapper.toDTO(dadosPlanos));
    }

    @GetMapping("/listaPortaria")
    public List<DatesDTO> listar() {
        List<QueryDTO> rows = solicitacaoRepository.listarPessoasPortaria(); // sua query
        return listLobbyMapper.toDiaList(rows);
    }

}
