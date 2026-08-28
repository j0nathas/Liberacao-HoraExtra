package com.jonathas.projetoHE.dto.query.mapper;

import com.jonathas.projetoHE.dto.query.JustificativasDTO;
import com.jonathas.projetoHE.dto.query.SolicitacaoDTO;
import com.jonathas.projetoHE.dto.query.SolicitacoesDTO;
import com.jonathas.projetoHE.dto.query.SolicitacoesFuncionariosDTO;
import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesJustificativas;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SolicitacaoMapper {

    public SolicitacaoDTO toDTO(Solicitacao entity) {
        return new SolicitacaoDTO(
                entity.getId(),
                entity.getData(),
                entity.getUsuario() != null ? entity.getUsuario().getNome() : "N/A",
                entity.getStatus(),
                entity.getToken(),
                entity.getSolicitacoes().stream().map(this::toSolicitacoesDTO).toList()
        );
    }

    private SolicitacoesDTO toSolicitacoesDTO(Solicitacoes item) {
        return new SolicitacoesDTO(
                item.getId(),
                item.getMotivosMacro() != null ? item.getMotivosMacro().getDescricao() : null,
                item.getTipo() != null ? item.getTipo().getTipo_solicitacao() : null,
                item.getDepartamento() != null ? item.getDepartamento().getDepartamento() : null,
                item.getTurno() != null ? item.getTurno().getTurno() : null,
                item.getInicio(),
                item.getFim(),
                item.getPlanta() != null ? item.getPlanta().getSigla() : null,
                item.getJustificativas().stream().map(this::toJustificativaDTO).toList()
        );
    }

    private JustificativasDTO toJustificativaDTO(SolicitacoesJustificativas j) {
        return new JustificativasDTO(
                j.getId(),
                j.getJustificativa(),
                j.getMaquina().getMaquina(),
                j.getFuncionarios().stream()
                        .map(f -> new SolicitacoesFuncionariosDTO(
                                f.getFuncionario().getName(),
                                f.getFuncionario().getRe()
                        ))
                        .toList()
        );
    }
}