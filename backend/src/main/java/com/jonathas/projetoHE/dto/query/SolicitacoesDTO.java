package com.jonathas.projetoHE.dto.query;

import java.util.Date;
import java.util.List;

public record SolicitacoesDTO(
        int id,
        Date data,
        String motivo_macro,
        String motivo_detalhado,
        String departamento,
        String turno,
        Date inicio,
        Date fim,
        String status,
        List<SolicitacoesFuncionariosDTO> funcionarios
        ) {
}
