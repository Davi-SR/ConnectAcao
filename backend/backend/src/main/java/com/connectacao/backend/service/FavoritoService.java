package com.connectacao.backend.service;

import com.connectacao.backend.entidade.Favorito;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;
import com.connectacao.backend.repository.FavoritoRepository;
import com.connectacao.backend.repository.OngRepository;
import com.connectacao.backend.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FavoritoService {
    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final OngRepository ongRepository;

    public FavoritoService(FavoritoRepository favoritoRepository, UsuarioRepository usuarioRepository,
                           OngRepository ongRepository) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.ongRepository = ongRepository;
    }

    public List<Ong> listarFavoritos(Long usuarioId) {
        validarId(usuarioId, "usuarioId");
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }

        List<Favorito> favoritos = favoritoRepository.findByUsuarioId(usuarioId);
        if (favoritos.isEmpty()) {
            return List.of();
        }

        List<Long> ongIds = favoritos.stream().map(Favorito::getOngId).toList();
        Map<Long, Ong> ongsPorId = new HashMap<>();
        for (Ong ong : ongRepository.findAllById(ongIds)) {
            ongsPorId.put(ong.getId(), ong);
        }

        return favoritos.stream()
                .map(favorito -> ongsPorId.computeIfAbsent(favorito.getOngId(), id -> {
                    throw new RecursoNaoEncontradoException("ONG nao encontrada");
                }))
                .toList();
    }

    public Favorito favoritar(Long usuarioId, Long ongId) {
        validarId(usuarioId, "usuarioId");
        validarId(ongId, "ongId");

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }
        if (!ongRepository.existsById(ongId)) {
            throw new RecursoNaoEncontradoException("ONG nao encontrada");
        }
        if (favoritoRepository.existsByUsuarioIdAndOngId(usuarioId, ongId)) {
            throw new ConflitoException("ONG ja esta nos favoritos");
        }

        Favorito favorito = new Favorito(usuarioId, ongId);
        favorito.setDataFavorito(LocalDateTime.now());
        try {
            return favoritoRepository.save(favorito);
        } catch (DataIntegrityViolationException exception) {
            throw new ConflitoException("ONG ja esta nos favoritos");
        }
    }

    @Transactional
    public void desfavoritar(Long usuarioId, Long ongId) {
        validarId(usuarioId, "usuarioId");
        validarId(ongId, "ongId");

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }
        if (!favoritoRepository.existsByUsuarioIdAndOngId(usuarioId, ongId)) {
            throw new RecursoNaoEncontradoException("Favorito nao encontrado");
        }
        favoritoRepository.deleteByUsuarioIdAndOngId(usuarioId, ongId);
    }

    private void validarId(Long id, String campo) {
        if (id == null || id <= 0) {
            throw new RequisicaoInvalidaException(campo + " deve ser maior que zero");
        }
    }
}