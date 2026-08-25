package com.connectacao.backend.service;

import com.connectacao.backend.entidade.Favorito;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.repository.FavoritoRepository;
import com.connectacao.backend.repository.OngRepository;
import com.connectacao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final OngRepository ongRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository,
            OngRepository ongRepository
    ) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.ongRepository = ongRepository;
    }

    public List<Ong> listarFavoritos(Long usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        List<Favorito> favoritos = favoritoRepository.findByUsuarioId(usuarioId);

        return favoritos.stream()
                .map(favorito -> ongRepository.findById(favorito.getOngId())
                        .orElseThrow(() -> new RuntimeException("ONG não encontrada")))
                .toList();
    }

    public Favorito favoritar(Long usuarioId, Long ongId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        if (!ongRepository.existsById(ongId)) {
            throw new RuntimeException("ONG não encontrada");
        }

        if (favoritoRepository.existsByUsuarioIdAndOngId(usuarioId, ongId)) {
            throw new RuntimeException("ONG já está nos favoritos");
        }

        Favorito favorito = new Favorito(usuarioId, ongId);

        return favoritoRepository.save(favorito);
    }

    @Transactional
    public void desfavoritar(Long usuarioId, Long ongId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        if (!favoritoRepository.existsByUsuarioIdAndOngId(usuarioId, ongId)) {
            throw new RuntimeException("Favorito não encontrado");
        }

        favoritoRepository.deleteByUsuarioIdAndOngId(usuarioId, ongId);
    }
}