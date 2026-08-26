package com.connectacao.backend.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final long expirationMillis;

    public JwtService(JwtEncoder encoder, JwtDecoder decoder, @Value("${app.jwt.expiration:3600000}") long expirationMillis) {
        this.encoder = encoder;
        this.decoder = decoder;
        this.expirationMillis = expirationMillis;
    }

    public String gerarToken(Long usuarioId) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusMillis(expirationMillis);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(usuarioId.toString())
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .build();
        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public Long extrairUsuarioId(String token) {
        Jwt jwt = decoder.decode(token);
        return Long.valueOf(jwt.getSubject());
    }

    public long getExpirationMillis() { return expirationMillis; }
}