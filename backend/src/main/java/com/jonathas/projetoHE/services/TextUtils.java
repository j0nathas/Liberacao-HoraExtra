package com.jonathas.projetoHE.services;

import java.text.Normalizer;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;

public class TextUtils {

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

    public static String calcularTempoDecorrido(LocalDateTime inicio, LocalDateTime fim, int totalPessoas) {
        if (inicio == null || fim == null) {
            return "Não informado";
        }

        Duration duracaoIndividual = Duration.between(inicio, fim);

        Duration duracaoTotal = duracaoIndividual.multipliedBy(totalPessoas);

        long horas = duracaoTotal.toHours();
        long minutos = duracaoTotal.toMinutes() % 60;

        return String.format("%dh%02dm", horas, minutos);
    }

}