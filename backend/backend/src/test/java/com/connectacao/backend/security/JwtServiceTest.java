package com.connectacao.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private JwtService jwtService;
    private JwtEncoder encoder;

    @BeforeEach
    void setUp() {
        SecretKey key = new SecretKeySpec("teste-segredo-jwt-com-mais-de-32-caracteres".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        encoder = NimbusJwtEncoder.withSecretKey(key).build();
        JwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256).build();
        jwtService = new JwtService(encoder, decoder, 3600000L);
    }

    @Test
    void geraTokenEExtraiUsuarioId() {
        String token = jwtService.gerarToken(42L);
        assertEquals(42L, jwtService.extrairUsuarioId(token));
        assertNotNull(token);
    }

    @Test
    void tokenAdulteradoERejeitado() {
        String token = jwtService.gerarToken(42L);
        String adulterado = token.substring(0, token.length() - 1) + (token.endsWith("a") ? "b" : "a");
        assertThrows(Exception.class, () -> jwtService.extrairUsuarioId(adulterado));
    }

    @Test
    void tokenExpiradoERejeitado() {
        Instant issuedAt = Instant.now().minusSeconds(120);
        Instant passado = Instant.now().minusSeconds(60);
        String token = encoder.encode(JwtEncoderParameters.from(JwtClaimsSet.builder()
                .subject("42").issuedAt(issuedAt).expiresAt(passado).build())).getTokenValue();
        assertThrows(Exception.class, () -> jwtService.extrairUsuarioId(token));
    }
}