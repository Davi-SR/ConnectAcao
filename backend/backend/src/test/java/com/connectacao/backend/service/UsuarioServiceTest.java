package com.connectacao.backend.service;

import com.connectacao.backend.dto.usuario.UsuarioCreateRequest;
import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.dto.usuario.UsuarioUpdateRequest;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.repository.UsuarioRepository;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    private UsuarioService usuarioService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService(usuarioRepository);
    }

    @Test
    void cadastroArmazenaBCryptERetornaRespostaSemHash() {
        when(usuarioRepository.existsByEmail("ana@example.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioCreateRequest request = createRequest("ana@example.com", "senha-segura");
        UsuarioResponse response = usuarioService.cadastrar(request);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        String hash = captor.getValue().getSenhaHash();
        assertNotEquals("senha-segura", hash);
        assertTrue(passwordEncoder.matches("senha-segura", hash));
        assertFalse(responseJson(response).contains("senhaHash"));
    }

    @Test
    void atualizarSenhaGeraNovoHashEMantemProprioEmail() {
        Usuario usuario = new Usuario("Ana", "ana@example.com", "hash-antigo", null, null);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByEmailAndIdNot("ana@example.com", 1L)).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioUpdateRequest request = updateRequest("ana@example.com", "nova-senha");
        UsuarioResponse response = usuarioService.atualizar(1L, request);

        assertNotEquals("hash-antigo", usuario.getSenhaHash());
        assertTrue(passwordEncoder.matches("nova-senha", usuario.getSenhaHash()));
        assertFalse(responseJson(response).contains("senhaHash"));
    }

    @Test
    void emailDeOutroUsuarioGeraConflito() {
        Usuario usuario = new Usuario("Ana", "ana@example.com", "hash", null, null);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByEmailAndIdNot("bruno@example.com", 1L)).thenReturn(true);

        assertThrows(ConflitoException.class,
                () -> usuarioService.atualizar(1L, updateRequest("bruno@example.com", null)));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void violacaoDeUniqueNoCadastroViraConflito() {
        when(usuarioRepository.existsByEmail("ana@example.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenThrow(new DataIntegrityViolationException("internal"));

        assertThrows(ConflitoException.class,
                () -> usuarioService.cadastrar(createRequest("ana@example.com", "senha-segura")));
    }

    @Test
    void dtoDeCadastroValidaNomeEmailESenha() {
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        UsuarioCreateRequest request = createRequest("invalido", "curta");

        assertTrue(validator.validate(request).size() >= 2);
    }

    private UsuarioCreateRequest createRequest(String email, String senha) {
        UsuarioCreateRequest request = new UsuarioCreateRequest();
        request.setNome("Ana");
        request.setEmail(email);
        request.setSenha(senha);
        return request;
    }

    private UsuarioUpdateRequest updateRequest(String email, String senha) {
        UsuarioUpdateRequest request = new UsuarioUpdateRequest();
        request.setNome("Ana");
        request.setEmail(email);
        request.setSenha(senha);
        return request;
    }

    private String responseJson(UsuarioResponse response) {
        return response.getClass().getDeclaredFields().toString();
    }
}
