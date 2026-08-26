package com.connectacao.backend.service;

import com.connectacao.backend.dto.doacao.DoacaoCreateRequest;
import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.entidade.Doacao;
import com.connectacao.backend.entidade.StatusCampanha;
import com.connectacao.backend.entidade.StatusDoacao;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;
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

    public DoacaoService(DoacaoRepository doacaoRepository, UsuarioRepository usuarioRepository,
                         CampanhaRepository campanhaRepository) {
        this.doacaoRepository = doacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.campanhaRepository = campanhaRepository;
    }

    public Doacao buscarPorId(Long id) {
        return doacaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Doacao nao encontrada"));
    }

    public Doacao realizarDoacao(DoacaoCreateRequest request) {
        validarRequest(request);

        if (usuarioRepository.findById(request.getUsuarioId()).isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }

        Campanha campanha = campanhaRepository.findById(request.getCampanhaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Campanha nao encontrada"));
        if (campanha.getStatus() != StatusCampanha.ATIVA) {
            throw new ConflitoException("Campanha nao esta ativa para receber doacoes");
        }

        Doacao doacao = new Doacao(request.getUsuarioId(), request.getCampanhaId(),
                request.getValor(), request.getFormaPagamento());
        doacao.setStatus(StatusDoacao.PENDENTE);
        doacao.setDataDoacao(LocalDateTime.now());
        return doacaoRepository.save(doacao);
    }

    private void validarRequest(DoacaoCreateRequest request) {
        if (request == null || request.getUsuarioId() == null || request.getCampanhaId() == null) {
            throw new RequisicaoInvalidaException("Usuario e campanha sao obrigatorios");
        }
        if (request.getValor() == null || request.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RequisicaoInvalidaException("O valor da doacao deve ser maior que zero");
        }
        if (request.getFormaPagamento() == null) {
            throw new RequisicaoInvalidaException("Forma de pagamento e obrigatoria");
        }
    }

    public List<Doacao> listarPorUsuario(Long usuarioId) {
        if (usuarioId == null || usuarioRepository.findById(usuarioId).isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }
        return doacaoRepository.findByUsuarioId(usuarioId);
    }
}