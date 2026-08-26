package com.connectacao.backend.service;

import com.connectacao.backend.dto.usuario.UsuarioCreateRequest;
import com.connectacao.backend.dto.usuario.UsuarioResponse;
import com.connectacao.backend.dto.usuario.UsuarioUpdateRequest;
import com.connectacao.backend.entidade.Usuario;
import com.connectacao.backend.exception.ConflitoException;
import com.connectacao.backend.exception.RecursoNaoEncontradoException;
import com.connectacao.backend.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse buscarPorId(Long id) {
        return new UsuarioResponse(buscarEntidadePorId(id));
    }

    public UsuarioResponse cadastrar(UsuarioCreateRequest dados) {
        if (usuarioRepository.existsByEmail(dados.getEmail())) {
            throw new ConflitoException("E-mail já cadastrado");
        }

        LocalDateTime agora = LocalDateTime.now();
        Usuario usuario = new Usuario(dados.getNome(), dados.getEmail(),
                passwordEncoder.encode(dados.getSenha()), dados.getTelefone(), dados.getFotoUrl());
        usuario.setCriadoEm(agora);
        usuario.setAtualizadoEm(agora);

        return salvarComConflitoSeguro(usuario);
    }

    public UsuarioResponse atualizar(Long id, UsuarioUpdateRequest dados) {
        Usuario usuario = buscarEntidadePorId(id);

        if (usuarioRepository.existsByEmailAndIdNot(dados.getEmail(), id)) {
            throw new ConflitoException("E-mail já cadastrado");
        }

        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        if (dados.getSenha() != null) {
            usuario.setSenhaHash(passwordEncoder.encode(dados.getSenha()));
        }
        usuario.setTelefone(dados.getTelefone());
        usuario.setFotoUrl(dados.getFotoUrl());
        usuario.setAtualizadoEm(LocalDateTime.now());

        return salvarComConflitoSeguro(usuario);
    }

    public void excluir(Long id) {
        usuarioRepository.delete(buscarEntidadePorId(id));
    }

    private Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    private UsuarioResponse salvarComConflitoSeguro(Usuario usuario) {
        try {
            return new UsuarioResponse(usuarioRepository.save(usuario));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflitoException("E-mail já cadastrado");
        }
    }
}
