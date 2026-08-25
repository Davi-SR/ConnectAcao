package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoacaoRepository extends JpaRepository<Doacao, Long> {

    List<Doacao> findByUsuarioId(Long usuarioId);
}