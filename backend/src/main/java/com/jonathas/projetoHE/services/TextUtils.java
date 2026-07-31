package com.jonathas.projetoHE.services;

import java.text.Normalizer;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

public class TextUtils {

    public record SolicitacaoDuracao(LocalDateTime inicio, LocalDateTime fim, int totalPessoas) {}

    public static String normalizar(String texto) {
        if (texto == null) return null;
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    public static String formatarParaLike(String texto) {
        String normalizado = normalizar(texto);
        if (normalizado == null || normalizado.isEmpty()) {
            return "%%";
        }
        return "%" + normalizado.replaceAll("\\s+", "%") + "%";
    }

    // Mantido para compatibilidade, caso seja usado em outro lugar
    public static String calcularTempoDecorrido(LocalDateTime inicio, LocalDateTime fim, int totalPessoas) {
        return calcularTempoTotal(List.of(new SolicitacaoDuracao(inicio, fim, totalPessoas)));
    }

    public static String calcularTempoTotal(List<SolicitacaoDuracao> duracoes) {
        Duration total = Duration.ZERO;

        for (SolicitacaoDuracao d : duracoes) {
            if (d.inicio() == null || d.fim() == null) continue;
            Duration individual = Duration.between(d.inicio(), d.fim());
            total = total.plus(individual.multipliedBy(d.totalPessoas()));
        }

        long horas = total.toHours();
        long minutos = total.toMinutes() % 60;

        return String.format("%dh%02dm", horas, minutos);
    }
}