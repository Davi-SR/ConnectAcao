package com.connectacao.backend.dto.campanha;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CampanhaDestaqueResponse(
        Long id,
        Long ongId,
        String ongNome,
        String titulo,
        String descricao,
        String imagemUrl,
        BigDecimal meta,
        BigDecimal valorArrecadado,
        BigDecimal percentualMeta,
        LocalDate dataFim
) {
}
