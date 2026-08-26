package com.connectacao.backend.auth;

import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.exception.CredenciaisInvalidasException;
import com.connectacao.backend.repository.UsuarioRepository;
import com.connectacao.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);
        if (usuario == null || !passwordEncoder.matches(request.getSenha(), usuario.getSenhaHash())) {
            throw new CredenciaisInvalidasException();
        }

        String token = jwtService.gerarToken(usuario.getId());
        return new LoginResponse(token, "Bearer", jwtService.getExpirationMillis(),
                new UsuarioResponse(usuario));
    }
}