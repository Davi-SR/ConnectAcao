package com.connectacao.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {

    @NotBlank(message = "E-mail e obrigatorio")
    @Email(message = "E-mail invalido")
    private String email;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    private String fotoUrl;
    private String googleId;

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String email, String nome, String fotoUrl) {
        this.email = email;
        this.nome = nome;
        this.fotoUrl = fotoUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
}
