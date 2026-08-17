package com.connectacao.backend.service;

import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.repository.CampanhaRepository;
import com.connectacao.backend.repository.OngRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CampanhaService {

    public static class DadosCampanhaInvalidosException extends RuntimeException {
        public DadosCampanhaInvalidosException(String mensagem) { super(mensagem); }
    }

    public static class OngNaoEncontradaException extends RuntimeException {
        public OngNaoEncontradaException(Long ongId) {
            super("ONG não encontrada: " + ongId);
        }
    }

    private final CampanhaRepository campanhaRepository;
    private final OngRepository ongRepository;

    public CampanhaService(CampanhaRepository campanhaRepository, OngRepository ongRepository) {
        this.campanhaRepository = campanhaRepository;
        this.ongRepository = ongRepository;
    }

    public List<Campanha> listarTodas() { return campanhaRepository.findAll(); }

    public Optional<Campanha> buscarPorId(Long id) { return campanhaRepository.findById(id); }

    public List<Campanha> listarPorOng(Long ongId) {
        validarOng(ongId);
        return campanhaRepository.findByOngId(ongId);
    }

    public Campanha criar(Campanha campanha) {
        validarDados(campanha);
        validarOng(campanha.getOngId());
        LocalDateTime agora = LocalDateTime.now();
        campanha.setCriadoEm(agora);
        campanha.setAtualizadoEm(agora);
        return campanhaRepository.save(campanha);
    }

    public Optional<Campanha> atualizar(Long id, Campanha campanha) {
        return campanhaRepository.findById(id).map(existente -> {
            validarDados(campanha);
            validarOng(campanha.getOngId());
            existente.setOngId(campanha.getOngId());
            existente.setTitulo(campanha.getTitulo());
            existente.setDescricao(campanha.getDescricao());
            existente.setMeta(campanha.getMeta());
            existente.setDataInicio(campanha.getDataInicio());
            existente.setDataFim(campanha.getDataFim());
            existente.setStatus(campanha.getStatus());
            existente.setImagemUrl(campanha.getImagemUrl());
            existente.setAtualizadoEm(LocalDateTime.now());
            return campanhaRepository.save(existente);
        });
    }

    public boolean excluir(Long id) {
        if (!campanhaRepository.existsById(id)) return false;
        campanhaRepository.deleteById(id);
        return true;
    }

    private void validarOng(Long ongId) {
        if (ongId == null || !ongRepository.existsById(ongId)) {
            throw new OngNaoEncontradaException(ongId);
        }
    }

    private void validarDados(Campanha campanha) {
        if (campanha == null || vazio(campanha.getTitulo()) || vazio(campanha.getDescricao())
                || campanha.getMeta() == null || campanha.getMeta().compareTo(BigDecimal.ZERO) <= 0
                || campanha.getDataInicio() == null || campanha.getStatus() == null) {
            throw new DadosCampanhaInvalidosException("Dados obrigatórios da campanha são inválidos.");
        }
        LocalDate dataFim = campanha.getDataFim();
        if (dataFim != null && dataFim.isBefore(campanha.getDataInicio())) {
            throw new DadosCampanhaInvalidosException("dataFim não pode ser anterior a dataInicio.");
        }
    }

    private boolean vazio(String valor) { return valor == null || valor.isBlank(); }
}
