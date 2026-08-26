package com.connectacao.backend.controller;

import com.connectacao.backend.dto.usuarioong.MembroOngResponse;
import com.connectacao.backend.dto.usuarioong.UsuarioOngCreateRequest;
import com.connectacao.backend.service.UsuarioOngService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ongs/{ongId}/membros")
public class UsuarioOngController {
    private final UsuarioOngService usuarioOngService;

    public UsuarioOngController(UsuarioOngService usuarioOngService) {
        this.usuarioOngService = usuarioOngService;
    }

    @GetMapping
    public ResponseEntity<List<MembroOngResponse>> listarMembros(@PathVariable Long ongId) {
        return ResponseEntity.ok(usuarioOngService.listarMembros(ongId));
    }

    @PostMapping("/{usuarioId}")
    public ResponseEntity<MembroOngResponse> adicionarMembro(
            @PathVariable Long ongId,
            @PathVariable Long usuarioId,
            @RequestBody(required = false) Optional<UsuarioOngCreateRequest> request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioOngService.adicionarMembro(ongId, usuarioId, request.orElse(null)));
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<MembroOngResponse> atualizarPapel(
            @PathVariable Long ongId,
            @PathVariable Long usuarioId,
            @RequestBody(required = false) UsuarioOngCreateRequest request) {
        return ResponseEntity.ok(usuarioOngService.atualizarPapel(ongId, usuarioId, request));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> removerMembro(@PathVariable Long ongId, @PathVariable Long usuarioId) {
        usuarioOngService.removerMembro(ongId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}