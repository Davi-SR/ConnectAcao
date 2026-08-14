package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.Ong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OngRepository extends JpaRepository<Ong, Long> {
    boolean existsByCategoriaId(Long categoriaId);
}
