package com.jonathas.projetoHE.dto.query;

public record SolicitacoesFuncionariosDTO(
        Long id,
        String nome,
        String RE,
        String codigoCentroCusto,
        String empresa,
        String cargo
) {
}
