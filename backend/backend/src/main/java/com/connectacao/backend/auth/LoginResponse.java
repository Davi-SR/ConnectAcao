package com.connectacao.backend.auth;

import com.connectacao.backend.dto.usuario.UsuarioResponse;

public class LoginResponse {
    private final String accessToken;
    private final String tokenType;
    private final long expiresIn;
    private final UsuarioResponse usuario;

    public LoginResponse(String accessToken, String tokenType, long expiresIn, UsuarioResponse usuario) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.usuario = usuario;
    }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }
    public long getExpiresIn() { return expiresIn; }
    public UsuarioResponse getUsuario() { return usuario; }
}