package com.connectacao.backend.dto.campanha;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CampanhaDestaqueResponse {

    private final Long id;
    private final Long ongId;
    private final String ongNome;
    private final String titulo;
    private final String descricao;
    private final String imagemUrl;
    private final BigDecimal meta;
    private final BigDecimal valorArrecadado;
    private final BigDecimal percentualMeta;
    private final LocalDate dataFim;

    public CampanhaDestaqueResponse(
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
        this.id = id;
        this.ongId = ongId;
        this.ongNome = ongNome;
        this.titulo = titulo;
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
        this.meta = meta;
        this.valorArrecadado = valorArrecadado;
        this.percentualMeta = percentualMeta;
        this.dataFim = dataFim;
    }

    public Long getId() { return id; }
    public Long id() { return id; }

    public Long getOngId() { return ongId; }
    public Long ongId() { return ongId; }

    public String getOngNome() { return ongNome; }
    public String ongNome() { return ongNome; }

    public String getTitulo() { return titulo; }
    public String titulo() { return titulo; }

    public String getDescricao() { return descricao; }
    public String descricao() { return descricao; }

    public String getImagemUrl() { return imagemUrl; }
    public String imagemUrl() { return imagemUrl; }

    public BigDecimal getMeta() { return meta; }
    public BigDecimal meta() { return meta; }

    public BigDecimal getValorArrecadado() { return valorArrecadado; }
    public BigDecimal valorArrecadado() { return valorArrecadado; }

    public BigDecimal getPercentualMeta() { return percentualMeta; }
    public BigDecimal percentualMeta() { return percentualMeta; }

    public LocalDate getDataFim() { return dataFim; }
    public LocalDate dataFim() { return dataFim; }
}
