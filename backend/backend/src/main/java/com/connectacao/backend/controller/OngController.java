package com.connectacao.backend.controller;

import com.connectacao.backend.dto.campanha.CampanhaDestaqueResponse;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.service.CampanhaService;
import com.connectacao.backend.service.OngService;
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

// Controller das Ongs
@RestController
@RequestMapping("/ongs")
public class OngController {

    private final OngService ongService;
    private final CampanhaService campanhaService;

    public OngController(OngService ongService, CampanhaService campanhaService) {
        this.ongService = ongService;
        this.campanhaService = campanhaService;
    }

    //CRUD das Ongs
    @GetMapping
    public List<Ong> listarTodas() {
        return ongService.listarTodas();
    }

    //Campanhas com progresso da ONG
    @GetMapping("/{id}/campanhas")
    public List<CampanhaDestaqueResponse> listarCampanhasPorOng(@PathVariable Long id) {
        return campanhaService.listarComProgressoPorOng(id);
    }

    //Pegar pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Ong> buscarPorId(@PathVariable Long id) {
        return ongService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Adicionar ONG
    @PostMapping
    public ResponseEntity<Ong> criar(@RequestBody Ong ong) {
        Ong ongCriada = ongService.criar(ong);
        return ResponseEntity.status(HttpStatus.CREATED).body(ongCriada);
    }

    //Atualizar ONG
    @PutMapping("/{id}")
    public ResponseEntity<Ong> atualizar(@PathVariable Long id, @RequestBody Ong ong) {
        return ongService.atualizar(id, ong)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    //Deletar ONG
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!ongService.excluir(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}