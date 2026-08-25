package com.connectacao.backend.entidade;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos")
@IdClass(FavoritoId.class)
public class Favorito {

    @Id
    @Column(name = "usuario_id")
    private Long usuarioId;

    @Id
    @Column(name = "ong_id")
    private Long ongId;

    @Column(name = "data_favorito", nullable = false)
    private LocalDateTime dataFavorito;

    public Favorito() {
    }

    public Favorito(Long usuarioId, Long ongId) {
        this.usuarioId = usuarioId;
        this.ongId = ongId;
    }

    @PrePersist
    public void prePersist() {
        this.dataFavorito = LocalDateTime.now();
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getOngId() {
        return ongId;
    }

    public void setOngId(Long ongId) {
        this.ongId = ongId;
    }

    public LocalDateTime getDataFavorito() {
        return dataFavorito;
    }

    public void setDataFavorito(LocalDateTime dataFavorito) {
        this.dataFavorito = dataFavorito;
    }
}