package com.jonathas.projetoHE.dto.query;

import com.jonathas.projetoHE.model.DeptResp;
import com.jonathas.projetoHE.model.TipoSolicitacao;

import java.time.ZonedDateTime;

public record TopHomeDTO (
        TipoSolicitacao tipoSolicitacao,
        DeptResp departamento,
        ZonedDateTime inicio,
        ZonedDateTime fim
){
}
