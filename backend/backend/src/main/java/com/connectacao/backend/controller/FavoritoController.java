package com.connectacao.backend.controller;

import com.connectacao.backend.entidade.Favorito;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.service.FavoritoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios/{usuarioId}/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public ResponseEntity<List<Ong>> listarFavoritos(
            @PathVariable Long usuarioId
    ) {
        List<Ong> favoritos = favoritoService.listarFavoritos(usuarioId);
        return ResponseEntity.ok(favoritos);
    }

    @PostMapping("/{ongId}")
    public ResponseEntity<Favorito> favoritar(
            @PathVariable Long usuarioId,
            @PathVariable Long ongId
    ) {
        Favorito favorito = favoritoService.favoritar(usuarioId, ongId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorito);
    }

    @DeleteMapping("/{ongId}")
    public ResponseEntity<Void> desfavoritar(
            @PathVariable Long usuarioId,
            @PathVariable Long ongId
    ) {
        favoritoService.desfavoritar(usuarioId, ongId);
        return ResponseEntity.noContent().build();
    }
}