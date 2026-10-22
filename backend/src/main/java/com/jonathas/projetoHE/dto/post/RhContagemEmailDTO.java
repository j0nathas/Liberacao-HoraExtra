package com.jonathas.projetoHE.dto.post;

import java.time.LocalDate;
import java.util.List;

public record RhContagemEmailDTO (
        List<LocalDate> datasSelecionadas,
        List<String> listaStatus
){
}
