package com.connectacao.backend.controller;

import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.service.CampanhaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ongs")
public class OngCampanhaController {

    private final CampanhaService campanhaService;

    public OngCampanhaController(CampanhaService campanhaService) {
        this.campanhaService = campanhaService;
    }

    @GetMapping("/{ongId}/campanhas")
    public ResponseEntity<List<Campanha>> listarPorOng(@PathVariable Long ongId) {
        try {
            return ResponseEntity.ok(campanhaService.listarPorOng(ongId));
        } catch (CampanhaService.OngNaoEncontradaException exception) {
            return ResponseEntity.notFound().build();
        }
    }
}
