package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.Favorito;
import com.connectacao.backend.entidade.FavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndOngId(Long usuarioId, Long ongId);

    void deleteByUsuarioIdAndOngId(Long usuarioId, Long ongId);
}