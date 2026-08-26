package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.UsuarioOng;
import com.connectacao.backend.entidade.UsuarioOngId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioOngRepository extends JpaRepository<UsuarioOng, UsuarioOngId> {
    List<UsuarioOng> findByOngId(Long ongId);
    List<UsuarioOng> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndOngId(Long usuarioId, Long ongId);
    void deleteByUsuarioIdAndOngId(Long usuarioId, Long ongId);
}