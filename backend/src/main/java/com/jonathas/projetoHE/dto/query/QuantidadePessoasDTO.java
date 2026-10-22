package com.jonathas.projetoHE.dto.query;

import java.time.LocalDate;
import java.util.List;

public record QuantidadePessoasDTO(
        LocalDate inicio,
        List<QntdePStatusDTO> status
) {}
