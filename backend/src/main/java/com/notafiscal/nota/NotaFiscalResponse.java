package com.notafiscal.nota;

import com.notafiscal.documento.DocumentoUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record NotaFiscalResponse(
        Long id,
        String numero,
        LocalDate dataEmissao,
        String emitenteRazaoSocial,
        String emitenteCnpj,
        String clienteNome,
        String clienteDocumento,
        String descricao,
        BigDecimal valor,
        LocalDateTime emitidaEm
) {
    public static NotaFiscalResponse from(NotaFiscal nota) {
        return new NotaFiscalResponse(
                nota.getId(),
                nota.getNumero(),
                nota.getDataEmissao(),
                nota.getEmitenteRazaoSocial(),
                DocumentoUtils.formatarCnpj(nota.getEmitenteCnpj()),
                nota.getClienteNome(),
                DocumentoUtils.formatarDocumento(nota.getClienteDocumento()),
                nota.getDescricao(),
                nota.getValor(),
                nota.getEmitidaEm()
        );
    }
}
