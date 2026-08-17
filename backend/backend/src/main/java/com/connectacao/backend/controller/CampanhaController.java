package com.connectacao.backend.controller;

import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.service.CampanhaService;
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

@RestController
@RequestMapping("/campanhas")
public class CampanhaController {

    private final CampanhaService campanhaService;

    public CampanhaController(CampanhaService campanhaService) {
        this.campanhaService = campanhaService;
    }

    @GetMapping
    public List<Campanha> listarTodas() { return campanhaService.listarTodas(); }

    @GetMapping("/{id}")
    public ResponseEntity<Campanha> buscarPorId(@PathVariable Long id) {
        return campanhaService.buscarPorId(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Campanha> criar(@RequestBody Campanha campanha) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(campanhaService.criar(campanha));
        } catch (CampanhaService.OngNaoEncontradaException exception) {
            return ResponseEntity.notFound().build();
        } catch (CampanhaService.DadosCampanhaInvalidosException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campanha> atualizar(@PathVariable Long id, @RequestBody Campanha campanha) {
        try {
            return campanhaService.atualizar(id, campanha).map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (CampanhaService.OngNaoEncontradaException exception) {
            return ResponseEntity.notFound().build();
        } catch (CampanhaService.DadosCampanhaInvalidosException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        return campanhaService.excluir(id) ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
