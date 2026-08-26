package com.connectacao.backend.dto.usuarioong;

import com.connectacao.backend.entidade.PapelOng;

import java.time.LocalDateTime;

public class MembroOngResponse {
    private final Long usuarioId;
    private final String nome;
    private final String email;
    private final String fotoUrl;
    private final PapelOng papel;
    private final LocalDateTime dataVinculo;

    public MembroOngResponse(Long usuarioId, String nome, String email, String fotoUrl,
                             PapelOng papel, LocalDateTime dataVinculo) {
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.email = email;
        this.fotoUrl = fotoUrl;
        this.papel = papel;
        this.dataVinculo = dataVinculo;
    }

    public Long getUsuarioId() { return usuarioId; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getFotoUrl() { return fotoUrl; }
    public PapelOng getPapel() { return papel; }
    public LocalDateTime getDataVinculo() { return dataVinculo; }
}