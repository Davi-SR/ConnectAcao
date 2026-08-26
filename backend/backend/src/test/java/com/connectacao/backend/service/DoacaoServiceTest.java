package com.connectacao.backend.service;

import com.connectacao.backend.dto.doacao.DoacaoCreateRequest;
import com.connectacao.backend.entidade.Campanha;
import com.connectacao.backend.entidade.Doacao;
import com.connectacao.backend.entidade.FormaPagamento;
import com.connectacao.backend.entidade.StatusCampanha;
import com.connectacao.backend.entidade.StatusDoacao;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;
import com.connectacao.backend.repository.CampanhaRepository;
import com.connectacao.backend.repository.DoacaoRepository;
import com.connectacao.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoacaoServiceTest {
    @Mock private DoacaoRepository doacaoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private CampanhaRepository campanhaRepository;
    private DoacaoService service;

    @BeforeEach
    void setUp() {
        service = new DoacaoService(doacaoRepository, usuarioRepository, campanhaRepository);
    }

    @Test
    void criaDoacaoValidaComoPendenteComDataEValor() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(new com.connectacao.backend.entidade.Usuario()));
        when(campanhaRepository.findById(5L)).thenReturn(Optional.of(campanha(StatusCampanha.ATIVA)));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Doacao doacao = service.realizarDoacao(request(new BigDecimal("50.00")));

        assertEquals(StatusDoacao.PENDENTE, doacao.getStatus());
        assertNotNull(doacao.getDataDoacao());
        assertEquals(new BigDecimal("50.00"), doacao.getValor());
        verify(doacaoRepository).save(any(Doacao.class));
    }

    @Test
    void usuarioInexistenteRetorna404() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RecursoNaoEncontradoException.class, () -> service.realizarDoacao(request(new BigDecimal("10"))));
        verifyNoInteractions(campanhaRepository, doacaoRepository);
    }

    @Test
    void campanhaInexistenteRetorna404() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(new com.connectacao.backend.entidade.Usuario()));
        when(campanhaRepository.findById(5L)).thenReturn(Optional.empty());
        assertThrows(RecursoNaoEncontradoException.class, () -> service.realizarDoacao(request(new BigDecimal("10"))));
        verifyNoInteractions(doacaoRepository);
    }

    @ParameterizedTest
    @EnumSource(value = StatusCampanha.class, names = {"RASCUNHO", "ENCERRADA", "CANCELADA"})
    void campanhaNaoAtivaRejeitaDoacao(StatusCampanha status) {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(new com.connectacao.backend.entidade.Usuario()));
        when(campanhaRepository.findById(5L)).thenReturn(Optional.of(campanha(status)));
        assertThrows(ConflitoException.class, () -> service.realizarDoacao(request(new BigDecimal("10"))));
        verifyNoInteractions(doacaoRepository);
    }

    @Test
    void valorZeroENegativoSaoRejeitados() {
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(request(BigDecimal.ZERO)));
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(request(new BigDecimal("-1"))));
        verifyNoInteractions(usuarioRepository, campanhaRepository, doacaoRepository);
    }

    @Test
    void formaPagamentoNulaERejeitada() {
        DoacaoCreateRequest request = request(new BigDecimal("10"));
        request.setFormaPagamento(null);
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(request));
    }

    @Test
    void idsNulosESolicitacaoNulaSaoRejeitados() {
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(null));
        DoacaoCreateRequest semUsuario = request(new BigDecimal("10"));
        semUsuario.setUsuarioId(null);
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(semUsuario));
        DoacaoCreateRequest semCampanha = request(new BigDecimal("10"));
        semCampanha.setCampanhaId(null);
        assertThrows(RequisicaoInvalidaException.class, () -> service.realizarDoacao(semCampanha));
    }

    private DoacaoCreateRequest request(BigDecimal valor) {
        DoacaoCreateRequest request = new DoacaoCreateRequest();
        request.setUsuarioId(1L);
        request.setCampanhaId(5L);
        request.setValor(valor);
        request.setFormaPagamento(FormaPagamento.PIX);
        return request;
    }

    private Campanha campanha(StatusCampanha status) {
        Campanha campanha = new Campanha();
        campanha.setStatus(status);
        return campanha;
    }
}