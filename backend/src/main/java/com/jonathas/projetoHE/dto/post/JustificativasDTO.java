package com.jonathas.projetoHE.dto.post;

import java.util.List;

public record JustificativasDTO(
        String id_maquina,
        String justificativa,
        List<SolicitacaoFuncionarioDTO> funcionarios
) {
}
