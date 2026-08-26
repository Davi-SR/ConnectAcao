package com.connectacao.backend.auth;

import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.exception.CredenciaisInvalidasException;
import com.connectacao.backend.repository.UsuarioRepository;
import com.connectacao.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.extension.ExtendWith.*;

@org.junit.jupiter.api.extension.ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() { authService = new AuthService(usuarioRepository, passwordEncoder, jwtService); }

    @Test
    void loginValidoGeraTokenERetornaUsuarioSeguro() {
        Usuario usuario = usuario(7L);
        when(usuarioRepository.findByEmail("ana@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-segura", "hash")).thenReturn(true);
        when(jwtService.gerarToken(7L)).thenReturn("token");
        when(jwtService.getExpirationMillis()).thenReturn(3600000L);

        LoginResponse response = authService.login(request("ana@example.com", "senha-segura"));

        assertEquals("token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(3600000L, response.getExpiresIn());
        assertEquals(7L, response.getUsuario().getId());
        assertFalse(response.getUsuario().getClass().getDeclaredFields().length == 0);
        verify(passwordEncoder).matches("senha-segura", "hash");
    }

    @Test
    void senhaIncorretaTemMensagemPublicaUnica() {
        Usuario usuario = usuario(7L);
        when(usuarioRepository.findByEmail("ana@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("errada", "hash")).thenReturn(false);

        CredenciaisInvalidasException exception = assertThrows(CredenciaisInvalidasException.class,
                () -> authService.login(request("ana@example.com", "errada")));

        assertEquals("Email ou senha invalidos", exception.getMessage());
        verifyNoInteractions(jwtService);
    }

    @Test
    void emailInexistenteTemMesmoComportamentoPublico() {
        when(usuarioRepository.findByEmail("ausente@example.com")).thenReturn(Optional.empty());

        CredenciaisInvalidasException exception = assertThrows(CredenciaisInvalidasException.class,
                () -> authService.login(request("ausente@example.com", "senha")));

        assertEquals("Email ou senha invalidos", exception.getMessage());
        verifyNoInteractions(passwordEncoder, jwtService);
    }

    private LoginRequest request(String email, String senha) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setSenha(senha);
        return request;
    }

    private Usuario usuario(Long id) {
        Usuario usuario = mock(Usuario.class);
        lenient().when(usuario.getId()).thenReturn(id);
        lenient().when(usuario.getNome()).thenReturn("Ana");
        lenient().when(usuario.getEmail()).thenReturn("ana@example.com");
        when(usuario.getSenhaHash()).thenReturn("hash");
        return usuario;
    }
}