package com.connectacao.backend.auth;

import com.connectacao.backend.config.SecurityConfig;
import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.service.UsuarioService;
import com.connectacao.backend.entidade.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.security.oauth2.jwt.JwtEncoderParameters.from;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MeController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = "app.jwt.secret=teste-segredo-jwt-com-mais-de-32-caracteres")
class MeSecurityTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private JwtEncoder jwtEncoder;
    @MockitoBean private UsuarioService usuarioService;

    @Test
    void meSemTokenRetorna401() throws Exception {
        mockMvc.perform(get("/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meComTokenInvalidoRetorna401() throws Exception {
        mockMvc.perform(get("/me").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meComTokenValidoRetornaUsuarioSeguro() throws Exception {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getId()).thenReturn(7L);
        when(usuario.getNome()).thenReturn("Ana");
        when(usuario.getEmail()).thenReturn("ana@example.com");
        when(usuarioService.buscarPorId(7L)).thenReturn(new UsuarioResponse(usuario));
        String token = jwtEncoder.encode(from(JwtClaimsSet.builder()
                .subject("7")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build())).getTokenValue();

        mockMvc.perform(get("/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }
}