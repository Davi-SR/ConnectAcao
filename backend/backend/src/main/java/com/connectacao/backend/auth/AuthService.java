package com.connectacao.backend.auth;

import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.exception.CredenciaisInvalidasException;
import com.connectacao.backend.repository.UsuarioRepository;
import com.connectacao.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getSenha() == null) {
            throw new CredenciaisInvalidasException();
        }
        String email = request.getEmail().trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null || usuario.getSenhaHash() == null || !passwordEncoder.matches(request.getSenha(), usuario.getSenhaHash())) {
            throw new CredenciaisInvalidasException();
        }

        String token = jwtService.gerarToken(usuario.getId());
        return new LoginResponse(token, "Bearer", jwtService.getExpirationMillis(),
                new UsuarioResponse(usuario));
    }

    public LoginResponse loginComGoogle(GoogleLoginRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new CredenciaisInvalidasException("Dados de autenticação do Google inválidos");
        }
        String email = request.getEmail().trim().toLowerCase();
        String nome = (request.getNome() != null && !request.getNome().trim().isEmpty()) ? request.getNome().trim() : "Usuário";
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            String senhaAleatoria = passwordEncoder.encode(UUID.randomUUID().toString());
            usuario = new Usuario(nome, email, senhaAleatoria, null, request.getFotoUrl());
            LocalDateTime agora = LocalDateTime.now();
            usuario.setCriadoEm(agora);
            usuario.setAtualizadoEm(agora);
            usuario = usuarioRepository.save(usuario);
        } else {
            boolean modificado = false;
            if (request.getFotoUrl() != null && !request.getFotoUrl().trim().isEmpty() && !request.getFotoUrl().equals(usuario.getFotoUrl())) {
                usuario.setFotoUrl(request.getFotoUrl());
                modificado = true;
            }
            if ((usuario.getNome() == null || usuario.getNome().trim().isEmpty()) && !nome.isEmpty()) {
                usuario.setNome(nome);
                modificado = true;
            }
            if (modificado) {
                usuario.setAtualizadoEm(LocalDateTime.now());
                usuario = usuarioRepository.save(usuario);
            }
        }

        String token = jwtService.gerarToken(usuario.getId());
        return new LoginResponse(token, "Bearer", jwtService.getExpirationMillis(),
                new UsuarioResponse(usuario));
    }
}