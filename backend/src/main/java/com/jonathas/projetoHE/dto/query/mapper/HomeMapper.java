package com.jonathas.projetoHE.dto.query.mapper;

import com.jonathas.projetoHE.dto.query.*;
import com.jonathas.projetoHE.model.Solicitacao;
import com.jonathas.projetoHE.model.Solicitacoes;
import com.jonathas.projetoHE.model.SolicitacoesJustificativas;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class HomeMapper {

    public HomeInfoDTO toDTO(Solicitacao entity) {
        return new HomeInfoDTO(
                entity.getId(),
                entity.getData(),
                entity.getStatus(),
                entity.getSolicitacoes().stream().map(this::toSolicitacoesDTO).toList()
        );
    }

    private TopHomeDTO toSolicitacoesDTO(Solicitacoes item) {
        return new TopHomeDTO(
                item.getTipo(),
                item.getDepartamento(),
                item.getInicio(),
                item.getFim()
        );
    }
}