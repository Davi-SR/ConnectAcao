package com.connectacao.backend.dto.usuario;

import com.connectacao.backend.entidade.Usuario;

import java.time.LocalDateTime;

public class UsuarioResponse {
    private final Long id;
    private final String nome;
    private final String email;
    private final String telefone;
    private final String fotoUrl;
    private final LocalDateTime criadoEm;
    private final LocalDateTime atualizadoEm;

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.fotoUrl = usuario.getFotoUrl();
        this.criadoEm = usuario.getCriadoEm();
        this.atualizadoEm = usuario.getAtualizadoEm();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getFotoUrl() { return fotoUrl; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
