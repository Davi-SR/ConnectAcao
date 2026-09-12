package com.connectacao.backend.service;

import com.connectacao.backend.dto.campanha.CampanhaDestaqueResponse;
import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.entidade.StatusCampanha;
import com.connectacao.backend.entidade.StatusDoacao;
import com.connectacao.backend.repository.CampanhaRepository;
import com.connectacao.backend.repository.DoacaoRepository;
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
    private final DoacaoRepository doacaoRepository;
    private final OngRepository ongRepository;

    public CampanhaService(CampanhaRepository campanhaRepository, DoacaoRepository doacaoRepository,
                           OngRepository ongRepository) {
        this.campanhaRepository = campanhaRepository;
        this.doacaoRepository = doacaoRepository;
        this.ongRepository = ongRepository;
    }

    public List<Campanha> listarTodas() { return campanhaRepository.findAll(); }

    public List<CampanhaDestaqueResponse> listarTodasComProgresso() {
        return campanhaRepository.findAll().stream()
                .map(this::paraDestaque)
                .toList();
    }

    public Optional<Campanha> buscarPorId(Long id) { return campanhaRepository.findById(id); }

    public Optional<CampanhaDestaqueResponse> buscarDestaque() {
        List<Campanha> ativas = campanhaRepository.findByStatus(StatusCampanha.ATIVA);
        List<Campanha> candidatas = (ativas != null && !ativas.isEmpty()) ? ativas : campanhaRepository.findAll();
        return candidatas.stream()
                .map(this::paraDestaque)
                .max((primeira, segunda) -> {
                    // 1º Critério: Maior percentual da meta atingido
                    BigDecimal p1 = primeira.percentualMeta() != null ? primeira.percentualMeta() : BigDecimal.ZERO;
                    BigDecimal p2 = segunda.percentualMeta() != null ? segunda.percentualMeta() : BigDecimal.ZERO;
                    int compPercentual = p1.compareTo(p2);
                    if (compPercentual != 0) return compPercentual;

                    // 2º Critério (Desempate): Maior volume financeiro total arrecadado
                    BigDecimal v1 = primeira.valorArrecadado() != null ? primeira.valorArrecadado() : BigDecimal.ZERO;
                    BigDecimal v2 = segunda.valorArrecadado() != null ? segunda.valorArrecadado() : BigDecimal.ZERO;
                    return v1.compareTo(v2);
                });
    }

    private CampanhaDestaqueResponse paraDestaque(Campanha campanha) {
        BigDecimal arrecadado = doacaoRepository.findValorTotalValidoByCampanhaId(campanha.getId());
        if (arrecadado == null) arrecadado = BigDecimal.ZERO;

        BigDecimal percentual = BigDecimal.ZERO;
        if (campanha.getMeta() != null && campanha.getMeta().compareTo(BigDecimal.ZERO) > 0) {
            percentual = arrecadado.multiply(BigDecimal.valueOf(100))
                    .divide(campanha.getMeta(), 2, java.math.RoundingMode.HALF_UP);
        }

        String ongNome = null;
        if (campanha.getOngId() != null) {
            ongNome = ongRepository.findById(campanha.getOngId())
                    .map(ong -> ong.getNome())
                    .orElse(null);
        }

        return new CampanhaDestaqueResponse(
                campanha.getId(),
                campanha.getOngId(),
                ongNome,
                campanha.getTitulo(),
                campanha.getDescricao(),
                campanha.getImagemUrl(),
                campanha.getMeta() != null ? campanha.getMeta() : BigDecimal.ZERO,
                arrecadado,
                percentual,
                campanha.getDataFim()
        );
    }

    public List<Campanha> listarPorOng(Long ongId) {
        validarOng(ongId);
        return campanhaRepository.findByOngId(ongId);
    }

    public List<CampanhaDestaqueResponse> listarComProgressoPorOng(Long ongId) {
        validarOng(ongId);
        List<Campanha> campanhas = campanhaRepository.findByOngId(ongId);
        if (campanhas == null) return List.of();
        return campanhas.stream()
                .map(this::paraDestaque)
                .toList();
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

    private boolean vazio(String valor) { return valor == null || valor.trim().isEmpty(); }
}
