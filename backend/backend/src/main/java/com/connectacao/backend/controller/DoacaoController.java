package com.connectacao.backend.controller;

import com.connectacao.backend.entidade.Doacao;
import com.connectacao.backend.service.DoacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping("/doacoes/{id}")
    public ResponseEntity<Doacao> buscarPorId(@PathVariable Long id) {
        Doacao doacao = doacaoService.buscarPorId(id);
        return ResponseEntity.ok(doacao);
    }

    @PostMapping("/doacoes")
    public ResponseEntity<Doacao> realizarDoacao(@RequestBody Doacao doacao) {
        Doacao novaDoacao = doacaoService.realizarDoacao(doacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDoacao);
    }

    @GetMapping("/usuarios/{id}/doacoes")
    public ResponseEntity<List<Doacao>> listarPorUsuario(@PathVariable Long id) {
        List<Doacao> doacoes = doacaoService.listarPorUsuario(id);
        return ResponseEntity.ok(doacoes);
    }
}