package com.notafiscal.nota;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sequencia_nota")
public class SequenciaAnual {

    @Id
    private Integer ano;

    @Column(nullable = false)
    private long ultimoNumero;

    protected SequenciaAnual() {
    }

    public SequenciaAnual(Integer ano) {
        this.ano = ano;
        this.ultimoNumero = 0;
    }

    public Integer getAno() {
        return ano;
    }

    public long getUltimoNumero() {
        return ultimoNumero;
    }

    public long proximo() {
        ultimoNumero++;
        return ultimoNumero;
    }
}
