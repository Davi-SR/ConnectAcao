package com.connectacao.backend.service;

import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;


import com.connectacao.backend.entidade.Doacao;
import com.connectacao.backend.entidade.StatusDoacao;
import com.connectacao.backend.repository.CampanhaRepository;
import com.connectacao.backend.repository.DoacaoRepository;
import com.connectacao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CampanhaRepository campanhaRepository;

    public DoacaoService(
            DoacaoRepository doacaoRepository,
            UsuarioRepository usuarioRepository,
            CampanhaRepository campanhaRepository
    ) {
        this.doacaoRepository = doacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.campanhaRepository = campanhaRepository;
    }

    public Doacao buscarPorId(Long id) {
        return doacaoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException("Doação não encontrada"));
    }

    public Doacao realizarDoacao(Doacao doacao) {

        if (!usuarioRepository.existsById(doacao.getUsuarioId())) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado");
        }

        if (!campanhaRepository.existsById(doacao.getCampanhaId())) {
            throw new RecursoNaoEncontradoException("Campanha não encontrada");
        }

        if (doacao.getValor() == null ||
                doacao.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RequisicaoInvalidaException(
                    "O valor da doação deve ser maior que zero"
            );
        }

        if (doacao.getFormaPagamento() == null) {
            throw new RequisicaoInvalidaException(
                    "Forma de pagamento é obrigatória"
            );
        }

        doacao.setStatus(StatusDoacao.PENDENTE);
        doacao.setDataDoacao(LocalDateTime.now());

        return doacaoRepository.save(doacao);
    }

    public List<Doacao> listarPorUsuario(Long usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado");
        }

        return doacaoRepository.findByUsuarioId(usuarioId);
    }
}