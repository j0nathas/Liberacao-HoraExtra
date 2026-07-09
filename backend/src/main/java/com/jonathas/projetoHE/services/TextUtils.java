package com.jonathas.projetoHE.services;

import java.text.Normalizer;
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
}