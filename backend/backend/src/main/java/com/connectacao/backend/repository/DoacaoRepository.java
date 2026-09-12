package com.connectacao.backend.repository;

import com.connectacao.backend.entidade.Doacao;
import com.connectacao.backend.entidade.StatusDoacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.math.BigDecimal;

public interface DoacaoRepository extends JpaRepository<Doacao, Long> {

    List<Doacao> findByUsuarioId(Long usuarioId);

    @Query("select coalesce(sum(d.valor), 0) from Doacao d where d.campanhaId = :campanhaId and d.status = :status")
    BigDecimal findValorTotalByCampanhaIdAndStatus(@Param("campanhaId") Long campanhaId,
                                                    @Param("status") StatusDoacao status);

    @Query("select coalesce(sum(d.valor), 0) from Doacao d where d.campanhaId = :campanhaId and d.status in (com.connectacao.backend.entidade.StatusDoacao.CONCLUIDA, com.connectacao.backend.entidade.StatusDoacao.PENDENTE)")
    BigDecimal findValorTotalValidoByCampanhaId(@Param("campanhaId") Long campanhaId);
}
