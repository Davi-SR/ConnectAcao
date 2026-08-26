package com.connectacao.backend.service;

import com.connectacao.backend.entidade.Favorito;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoritoServiceTest {
    @Mock private com.connectacao.backend.repository.FavoritoRepository favoritoRepository;
    @Mock private com.connectacao.backend.repository.UsuarioRepository usuarioRepository;
    @Mock private com.connectacao.backend.repository.OngRepository ongRepository;
    private FavoritoService service;

    @BeforeEach
    void setUp() {
        service = new FavoritoService(favoritoRepository, usuarioRepository, ongRepository);
    }

    @Test
    void favoritarComSucessoPreencheIdsEData() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(ongRepository.existsById(7L)).thenReturn(true);
        when(favoritoRepository.save(any(Favorito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Favorito favorito = service.favoritar(1L, 7L);

        assertEquals(1L, favorito.getUsuarioId());
        assertEquals(7L, favorito.getOngId());
        assertNotNull(favorito.getDataFavorito());
        verify(favoritoRepository).save(any(Favorito.class));
    }

    @Test
    void usuarioInexistenteRetorna404() {
        when(usuarioRepository.existsById(1L)).thenReturn(false);
        assertThrows(RecursoNaoEncontradoException.class, () -> service.favoritar(1L, 7L));
        verifyNoInteractions(ongRepository, favoritoRepository);
    }

    @Test
    void ongInexistenteRetorna404() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(ongRepository.existsById(7L)).thenReturn(false);
        assertThrows(RecursoNaoEncontradoException.class, () -> service.favoritar(1L, 7L));
        verifyNoInteractions(favoritoRepository);
    }

    @Test
    void favoritoExistenteRetorna409() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(ongRepository.existsById(7L)).thenReturn(true);
        when(favoritoRepository.existsByUsuarioIdAndOngId(1L, 7L)).thenReturn(true);
        assertThrows(ConflitoException.class, () -> service.favoritar(1L, 7L));
        verify(favoritoRepository, never()).save(any());
    }

    @Test
    void duplicidadeConcorrenteRetorna409() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(ongRepository.existsById(7L)).thenReturn(true);
        when(favoritoRepository.save(any(Favorito.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));

        assertThrows(ConflitoException.class, () -> service.favoritar(1L, 7L));
    }

    @Test
    void removeFavoritoExistente() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(favoritoRepository.existsByUsuarioIdAndOngId(1L, 7L)).thenReturn(true);

        service.desfavoritar(1L, 7L);

        verify(favoritoRepository).deleteByUsuarioIdAndOngId(1L, 7L);
    }

    @Test
    void removeFavoritoInexistenteRetorna404() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(favoritoRepository.existsByUsuarioIdAndOngId(1L, 7L)).thenReturn(false);
        assertThrows(RecursoNaoEncontradoException.class, () -> service.desfavoritar(1L, 7L));
        verify(favoritoRepository, never()).deleteByUsuarioIdAndOngId(anyLong(), anyLong());
    }

    @Test
    void usuarioExistenteSemFavoritosRetornaListaVazia() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(favoritoRepository.findByUsuarioId(1L)).thenReturn(List.of());

        assertEquals(List.of(), service.listarFavoritos(1L));
        verify(ongRepository, never()).findAllById(any());
    }

    @Test
    void listaMultiplosFavoritosUsaConsultaEmLoteEPreservaOrdem() {
        Favorito primeiro = new Favorito(1L, 7L);
        Favorito segundo = new Favorito(1L, 3L);
        Ong ongSete = mock(Ong.class);
        Ong ongTres = mock(Ong.class);
        when(ongSete.getId()).thenReturn(7L);
        when(ongTres.getId()).thenReturn(3L);
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(favoritoRepository.findByUsuarioId(1L)).thenReturn(List.of(primeiro, segundo));
        when(ongRepository.findAllById(List.of(7L, 3L))).thenReturn(List.of(ongTres, ongSete));

        List<Ong> resultado = service.listarFavoritos(1L);

        assertEquals(List.of(ongSete, ongTres), resultado);
        verify(ongRepository).findAllById(List.of(7L, 3L));
        verify(ongRepository, never()).findById(anyLong());
    }
}