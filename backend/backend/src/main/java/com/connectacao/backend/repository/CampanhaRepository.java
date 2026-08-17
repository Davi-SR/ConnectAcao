package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.Campanha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampanhaRepository extends JpaRepository<Campanha, Long> {
    List<Campanha> findByOngId(Long ongId);
}
