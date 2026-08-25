package com.connectacao.backend.entidade;

import java.io.Serializable;
import java.util.Objects;

public class FavoritoId implements Serializable {

    private Long usuarioId;
    private Long ongId;

    public FavoritoId() {
    }

    public FavoritoId(Long usuarioId, Long ongId) {
        this.usuarioId = usuarioId;
        this.ongId = ongId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavoritoId)) return false;

        FavoritoId that = (FavoritoId) o;

        return Objects.equals(usuarioId, that.usuarioId)
                && Objects.equals(ongId, that.ongId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, ongId);
    }
}