package com.connectacao.backend.service;

import com.connectacao.backend.dto.usuarioong.MembroOngResponse;
import com.connectacao.backend.dto.usuarioong.UsuarioOngCreateRequest;
import com.connectacao.backend.entidade.PapelOng;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.entidade.UsuarioOng;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioOngServiceTest {
    @Mock private com.connectacao.backend.repository.UsuarioOngRepository usuarioOngRepository;
    @Mock private com.connectacao.backend.repository.UsuarioRepository usuarioRepository;
    @Mock private com.connectacao.backend.repository.OngRepository ongRepository;
    private UsuarioOngService service;

    @BeforeEach
    void setUp() {
        service = new UsuarioOngService(usuarioOngRepository, usuarioRepository, ongRepository);
    }

    @Test
    void adicionaMembroComSucesso() {
        prepararExistencias();
        when(usuarioOngRepository.save(any(UsuarioOng.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MembroOngResponse response = service.adicionarMembro(5L, 10L, request(PapelOng.MEMBRO));

        assertEquals(10L, response.getUsuarioId());
        assertEquals(PapelOng.MEMBRO, response.getPapel());
        verify(usuarioOngRepository).save(any(UsuarioOng.class));
    }

    @Test
    void adicionaAdminComSucesso() {
        prepararExistencias();
        when(usuarioOngRepository.save(any(UsuarioOng.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MembroOngResponse response = service.adicionarMembro(5L, 10L, request(PapelOng.ADMIN));

        assertEquals(PapelOng.ADMIN, response.getPapel());
    }

    @Test
    void papelAusenteAssumeMembro() {
        prepararExistencias();
        when(usuarioOngRepository.save(any(UsuarioOng.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MembroOngResponse response = service.adicionarMembro(5L, 10L, new UsuarioOngCreateRequest());

        assertEquals(PapelOng.MEMBRO, response.getPapel());
    }

    @Test
    void usuarioInexistenteRetorna404() {
        when(ongRepository.existsById(5L)).thenReturn(true);
        when(usuarioRepository.existsById(10L)).thenReturn(false);

        assertThrows(RecursoNaoEncontradoException.class,
                () -> service.adicionarMembro(5L, 10L, request(PapelOng.MEMBRO)));
        verifyNoInteractions(usuarioOngRepository);
    }

    @Test
    void ongInexistenteRetorna404() {
        when(ongRepository.existsById(5L)).thenReturn(false);

        assertThrows(RecursoNaoEncontradoException.class,
                () -> service.adicionarMembro(5L, 10L, request(PapelOng.MEMBRO)));
        verifyNoInteractions(usuarioRepository, usuarioOngRepository);
    }

    @Test
    void vinculoDuplicadoRetorna409() {
        when(ongRepository.existsById(5L)).thenReturn(true);
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(usuarioOngRepository.existsByUsuarioIdAndOngId(10L, 5L)).thenReturn(true);

        assertThrows(ConflitoException.class,
                () -> service.adicionarMembro(5L, 10L, request(PapelOng.MEMBRO)));
        verify(usuarioOngRepository, never()).save(any());
    }

    @Test
    void duplicidadeConcorrenteRetorna409() {
        prepararExistencias();
        when(usuarioOngRepository.save(any(UsuarioOng.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));

        assertThrows(ConflitoException.class,
                () -> service.adicionarMembro(5L, 10L, request(PapelOng.MEMBRO)));
    }

    @Test
    void ongSemMembrosRetornaListaVazia() {
        when(ongRepository.existsById(5L)).thenReturn(true);
        when(usuarioOngRepository.findByOngId(5L)).thenReturn(List.of());

        assertEquals(List.of(), service.listarMembros(5L));
        verify(usuarioRepository, never()).findAllById(any());
    }

    @Test
    void listaMembrosUsaConsultaEmLoteEPreservaOrdem() {
        UsuarioOng primeiro = new UsuarioOng(10L, 5L, PapelOng.ADMIN);
        UsuarioOng segundo = new UsuarioOng(11L, 5L, PapelOng.MEMBRO);
        Usuario maria = usuario(10L, "Maria");
        Usuario joao = usuario(11L, "Joao");
        when(ongRepository.existsById(5L)).thenReturn(true);
        when(usuarioOngRepository.findByOngId(5L)).thenReturn(List.of(primeiro, segundo));
        when(usuarioRepository.findAllById(List.of(10L, 11L))).thenReturn(List.of(joao, maria));

        List<MembroOngResponse> resposta = service.listarMembros(5L);

        assertEquals(List.of(10L, 11L), resposta.stream().map(MembroOngResponse::getUsuarioId).toList());
        verify(usuarioRepository).findAllById(List.of(10L, 11L));
        verify(usuarioRepository, never()).findById(anyLong());
    }

    @Test
    void atualizarMembroParaAdmin() {
        UsuarioOng vinculo = new UsuarioOng(10L, 5L, PapelOng.MEMBRO);
        prepararVinculo(vinculo);
        when(usuarioOngRepository.save(any(UsuarioOng.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MembroOngResponse response = service.atualizarPapel(5L, 10L, request(PapelOng.ADMIN));

        assertEquals(PapelOng.ADMIN, response.getPapel());
    }

    @Test
    void atualizarAdminParaMembro() {
        UsuarioOng vinculo = new UsuarioOng(10L, 5L, PapelOng.ADMIN);
        prepararVinculo(vinculo);
        when(usuarioOngRepository.save(any(UsuarioOng.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MembroOngResponse response = service.atualizarPapel(5L, 10L, request(PapelOng.MEMBRO));

        assertEquals(PapelOng.MEMBRO, response.getPapel());
    }

    @Test
    void atualizarVinculoInexistenteRetorna404() {
        when(usuarioOngRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(RecursoNaoEncontradoException.class,
                () -> service.atualizarPapel(5L, 10L, request(PapelOng.ADMIN)));
        verify(usuarioOngRepository, never()).save(any());
    }

    @Test
    void removeVinculoExistente() {
        prepararVinculo(new UsuarioOng(10L, 5L, PapelOng.MEMBRO));

        service.removerMembro(5L, 10L);

        verify(usuarioOngRepository).deleteByUsuarioIdAndOngId(10L, 5L);
    }

    @Test
    void removeVinculoInexistenteRetorna404() {
        when(usuarioOngRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(RecursoNaoEncontradoException.class, () -> service.removerMembro(5L, 10L));
        verify(usuarioOngRepository, never()).deleteByUsuarioIdAndOngId(anyLong(), anyLong());
    }

    @Test
    void idsInvalidosRetornam400() {
        assertThrows(RequisicaoInvalidaException.class,
                () -> service.listarMembros(0L));
        assertThrows(RequisicaoInvalidaException.class,
                () -> service.adicionarMembro(5L, null, request(PapelOng.MEMBRO)));
        assertThrows(RequisicaoInvalidaException.class,
                () -> service.atualizarPapel(-1L, 10L, request(PapelOng.ADMIN)));
        assertThrows(RequisicaoInvalidaException.class,
                () -> service.removerMembro(null, 10L));
    }

    private void prepararExistencias() {
        when(ongRepository.existsById(5L)).thenReturn(true);
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        Usuario usuario = usuario(10L, "Maria");
        lenient().when(usuarioRepository.findById(10L)).thenReturn(Optional.of(usuario));
        when(usuarioOngRepository.existsByUsuarioIdAndOngId(10L, 5L)).thenReturn(false);
    }

    private void prepararVinculo(UsuarioOng vinculo) {
        when(usuarioOngRepository.findById(any())).thenReturn(Optional.of(vinculo));
        Usuario usuario = usuario(10L, "Maria");
        lenient().when(usuarioRepository.findById(10L)).thenReturn(Optional.of(usuario));
    }

    private UsuarioOngCreateRequest request(PapelOng papel) {
        UsuarioOngCreateRequest request = new UsuarioOngCreateRequest();
        request.setPapel(papel);
        return request;
    }

    private Usuario usuario(Long id, String nome) {
        Usuario usuario = mock(Usuario.class);
        lenient().when(usuario.getId()).thenReturn(id);
        lenient().when(usuario.getNome()).thenReturn(nome);
        lenient().when(usuario.getEmail()).thenReturn(nome.toLowerCase() + "@example.com");
        return usuario;
    }
}