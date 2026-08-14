package com.connectacao.backend.service;
import com.connectacao.backend.entidade.Ong;
import com.connectacao.backend.repository.OngRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


// Service das ONGs
@Service
public class OngService {

    private final OngRepository ongRepository;

    public OngService(OngRepository ongRepository) {
        this.ongRepository = ongRepository;
    }

    // Função para listar as Ongs
    public List<Ong> listarTodas() {
        return ongRepository.findAll();
    }

    // Função API para listar pelo ID
    public Optional<Ong> buscarPorId(Long id) {
        return ongRepository.findById(id);
    }

    public Ong criar(Ong ong) {
        return ongRepository.save(ong);
    }

    public Optional<Ong> atualizar(Long id, Ong ong) {
        return ongRepository.findById(id)
                .map(ongExistente -> {
                    ongExistente.setCategoriaId(ong.getCategoriaId());
                    ongExistente.setNome(ong.getNome());
                    ongExistente.setCnpj(ong.getCnpj());
                    ongExistente.setDescricao(ong.getDescricao());
                    ongExistente.setEmail(ong.getEmail());
                    ongExistente.setTelefone(ong.getTelefone());
                    ongExistente.setCep(ong.getCep());
                    ongExistente.setLogradouro(ong.getLogradouro());
                    ongExistente.setNumero(ong.getNumero());
                    ongExistente.setComplemento(ong.getComplemento());
                    ongExistente.setBairro(ong.getBairro());
                    ongExistente.setCidade(ong.getCidade());
                    ongExistente.setEstado(ong.getEstado());
                    ongExistente.setLatitude(ong.getLatitude());
                    ongExistente.setLongitude(ong.getLongitude());
                    ongExistente.setImagemUrl(ong.getImagemUrl());
                    ongExistente.setCriadoEm(ong.getCriadoEm());
                    ongExistente.setAtualizadoEm(ong.getAtualizadoEm());
                    return ongRepository.save(ongExistente);
                });
    }

    public boolean excluir(Long id) {
        if (!ongRepository.existsById(id)) {
            return false;
        }

        ongRepository.deleteById(id);
        return true;
    }
}