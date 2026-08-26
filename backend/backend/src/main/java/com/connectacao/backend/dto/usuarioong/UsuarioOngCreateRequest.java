package com.connectacao.backend.dto.usuarioong;

import com.connectacao.backend.entidade.PapelOng;

public class UsuarioOngCreateRequest {
    private PapelOng papel;

    public PapelOng getPapel() { return papel; }
    public void setPapel(PapelOng papel) { this.papel = papel; }
}