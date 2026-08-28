package com.jonathas.projetoHE.dto.query;

import java.util.List;

public record JustificativasDTO(
        Long id,
        String justificativa,
        String maquina,
        List<SolicitacoesFuncionariosDTO> funcionarios
) {}
