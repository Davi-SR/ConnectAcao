package com.connectacao.backend.entidade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios_ongs")
@IdClass(UsuarioOngId.class)
public class UsuarioOng {
    @Id
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Id
    @Column(name = "ong_id", nullable = false)
    private Long ongId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "papel_ong")
    private PapelOng papel;

    @Column(name = "data_vinculo", nullable = false)
    private LocalDateTime dataVinculo;

    public UsuarioOng() {
    }

    public UsuarioOng(Long usuarioId, Long ongId, PapelOng papel) {
        this.usuarioId = usuarioId;
        this.ongId = ongId;
        this.papel = papel;
    }

    @PrePersist
    public void prePersist() {
        if (dataVinculo == null) {
            dataVinculo = LocalDateTime.now();
        }
    }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getOngId() { return ongId; }
    public void setOngId(Long ongId) { this.ongId = ongId; }
    public PapelOng getPapel() { return papel; }
    public void setPapel(PapelOng papel) { this.papel = papel; }
    public LocalDateTime getDataVinculo() { return dataVinculo; }
    public void setDataVinculo(LocalDateTime dataVinculo) { this.dataVinculo = dataVinculo; }
}