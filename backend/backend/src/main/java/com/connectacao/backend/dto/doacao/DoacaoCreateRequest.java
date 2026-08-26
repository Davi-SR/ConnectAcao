package com.connectacao.backend.dto.doacao;

import com.connectacao.backend.entidade.FormaPagamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DoacaoCreateRequest {
    @NotNull private Long usuarioId;
    @NotNull private Long campanhaId;
    @NotNull @DecimalMin(value = "0.00", inclusive = false) private BigDecimal valor;
    @NotNull private FormaPagamento formaPagamento;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getCampanhaId() { return campanhaId; }
    public void setCampanhaId(Long campanhaId) { this.campanhaId = campanhaId; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }
}