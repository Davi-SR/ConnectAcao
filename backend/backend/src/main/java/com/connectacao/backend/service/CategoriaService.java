package com.connectacao.backend.service;

import com.connectacao.backend.entidade.Categoria;
import com.connectacao.backend.repository.CategoriaRepository;
import com.connectacao.backend.repository.OngRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    public enum ResultadoExclusao {
        EXCLUIDA,
        NAO_ENCONTRADA,
        POSSUI_ONGS_VINCULADAS
    }

    private final CategoriaRepository categoriaRepository;
    private final OngRepository ongRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, OngRepository ongRepository) {
        this.categoriaRepository = categoriaRepository;
        this.ongRepository = ongRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    public Categoria criar(Categoria categoria) {
        validarNomeDuplicado(categoria.getNome());
        return categoriaRepository.save(categoria);
    }

    public Optional<Categoria> atualizar(Long id, Categoria categoria) {
        return categoriaRepository.findById(id)
                .map(categoriaExistente -> {
                    if (!categoriaExistente.getNome().equals(categoria.getNome())) {
                        validarNomeDuplicado(categoria.getNome());
                    }

                    categoriaExistente.setNome(categoria.getNome());
                    categoriaExistente.setDescricao(categoria.getDescricao());
                    return categoriaRepository.save(categoriaExistente);
                });
    }

    public ResultadoExclusao excluir(Long id) {
        if (!categoriaRepository.existsById(id)) {
            return ResultadoExclusao.NAO_ENCONTRADA;
        }

        if (ongRepository.existsByCategoriaId(id)) {
            return ResultadoExclusao.POSSUI_ONGS_VINCULADAS;
        }

        categoriaRepository.deleteById(id);
        return ResultadoExclusao.EXCLUIDA;
    }

    private void validarNomeDuplicado(String nome) {
        if (categoriaRepository.existsByNome(nome)) {
            throw new IllegalStateException("Já existe uma categoria com esse nome.");
        }
    }
}
