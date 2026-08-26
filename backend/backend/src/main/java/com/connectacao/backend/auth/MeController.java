package com.connectacao.backend.auth;

import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.service.UsuarioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {
    private final UsuarioService usuarioService;

    public MeController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(usuarioService.buscarPorId(Long.valueOf(jwt.getSubject())));
    }
}