package com.connectacao.backend.service;

import com.connectacao.backend.dto.usuarioong.MembroOngResponse;
import com.connectacao.backend.dto.usuarioong.UsuarioOngCreateRequest;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.entidade.PapelOng;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.entidade.UsuarioOng;
import com.connectacao.backend.entidade.UsuarioOngId;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.exception.RequisicaoInvalidaException;
import com.connectacao.backend.repository.OngRepository;
import com.connectacao.backend.repository.UsuarioOngRepository;
import com.connectacao.backend.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UsuarioOngService {
    private final UsuarioOngRepository usuarioOngRepository;
    private final UsuarioRepository usuarioRepository;
    private final OngRepository ongRepository;

    public UsuarioOngService(UsuarioOngRepository usuarioOngRepository,
                             UsuarioRepository usuarioRepository,
                             OngRepository ongRepository) {
        this.usuarioOngRepository = usuarioOngRepository;
        this.usuarioRepository = usuarioRepository;
        this.ongRepository = ongRepository;
    }

    public List<MembroOngResponse> listarMembros(Long ongId) {
        validarId(ongId, "ongId");
        if (!ongRepository.existsById(ongId)) {
            throw new RecursoNaoEncontradoException("ONG nao encontrada");
        }

        List<UsuarioOng> vinculos = usuarioOngRepository.findByOngId(ongId);
        if (vinculos.isEmpty()) {
            return List.of();
        }

        List<Long> usuarioIds = vinculos.stream().map(UsuarioOng::getUsuarioId).toList();
        Map<Long, Usuario> usuariosPorId = new HashMap<>();
        for (Usuario usuario : usuarioRepository.findAllById(usuarioIds)) {
            usuariosPorId.put(usuario.getId(), usuario);
        }

        return vinculos.stream()
                .map(vinculo -> criarResposta(vinculo, usuariosPorId.get(vinculo.getUsuarioId())))
                .toList();
    }

    public MembroOngResponse adicionarMembro(Long ongId, Long usuarioId, UsuarioOngCreateRequest request) {
        validarIds(ongId, usuarioId);
        if (!ongRepository.existsById(ongId)) {
            throw new RecursoNaoEncontradoException("ONG nao encontrada");
        }
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }
        if (usuarioOngRepository.existsByUsuarioIdAndOngId(usuarioId, ongId)) {
            throw new ConflitoException("Usuario ja e membro desta ONG");
        }

        PapelOng papel = papelOuPadrao(request);
        UsuarioOng vinculo = new UsuarioOng(usuarioId, ongId, papel);
        vinculo.setDataVinculo(LocalDateTime.now());
        try {
            UsuarioOng salvo = usuarioOngRepository.save(vinculo);
            return criarResposta(salvo, buscarUsuario(usuarioId));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflitoException("Usuario ja e membro desta ONG");
        }
    }

    public MembroOngResponse atualizarPapel(Long ongId, Long usuarioId, UsuarioOngCreateRequest request) {
        validarIds(ongId, usuarioId);
        UsuarioOng vinculo = buscarVinculo(ongId, usuarioId);
        vinculo.setPapel(papelOuPadrao(request));
        UsuarioOng salvo = usuarioOngRepository.save(vinculo);
        return criarResposta(salvo, buscarUsuario(usuarioId));
    }

    @Transactional
    public void removerMembro(Long ongId, Long usuarioId) {
        validarIds(ongId, usuarioId);
        buscarVinculo(ongId, usuarioId);
        usuarioOngRepository.deleteByUsuarioIdAndOngId(usuarioId, ongId);
    }

    private UsuarioOng buscarVinculo(Long ongId, Long usuarioId) {
        return usuarioOngRepository.findById(new UsuarioOngId(usuarioId, ongId))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vinculo nao encontrado"));
    }

    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));
    }

    private MembroOngResponse criarResposta(UsuarioOng vinculo, Usuario usuario) {
        if (usuario == null) {
            throw new RecursoNaoEncontradoException("Usuario nao encontrado");
        }
        return new MembroOngResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                usuario.getFotoUrl(), vinculo.getPapel(), vinculo.getDataVinculo());
    }

    private PapelOng papelOuPadrao(UsuarioOngCreateRequest request) {
        return request == null || request.getPapel() == null ? PapelOng.MEMBRO : request.getPapel();
    }

    private void validarIds(Long ongId, Long usuarioId) {
        validarId(ongId, "ongId");
        validarId(usuarioId, "usuarioId");
    }

    private void validarId(Long id, String campo) {
        if (id == null || id <= 0) {
            throw new RequisicaoInvalidaException(campo + " deve ser maior que zero");
        }
    }
}