package com.notafiscal.nota;

import com.notafiscal.documento.DocumentoUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class NotaFiscalService {

    private static final ZoneId FUSO = ZoneId.of("America/Sao_Paulo");

    private final NotaFiscalRepository notas;
    private final SequenciaAnualRepository sequencias;

    public NotaFiscalService(NotaFiscalRepository notas, SequenciaAnualRepository sequencias) {
        this.notas = notas;
        this.sequencias = sequencias;
    }

    @Transactional
    public NotaFiscalResponse gerar(GerarNotaRequest request) {
        String cnpj = DocumentoUtils.somenteDigitos(request.emitenteCnpj());
        String documentoCliente = DocumentoUtils.somenteDigitos(request.clienteDocumento());

        if (!DocumentoUtils.cnpjValido(cnpj)) {
            throw new DocumentoInvalidoException("emitenteCnpj", "CNPJ do emitente inválido");
        }
        if (!DocumentoUtils.cpfOuCnpjValido(documentoCliente)) {
            throw new DocumentoInvalidoException("clienteDocumento", "CPF ou CNPJ do cliente inválido");
        }

        NotaFiscal nota = new NotaFiscal();
        nota.setNumero(proximoNumero(request.dataEmissao().getYear()));
        nota.setDataEmissao(request.dataEmissao());
        nota.setEmitenteRazaoSocial(request.emitenteRazaoSocial().trim());
        nota.setEmitenteCnpj(cnpj);
        nota.setClienteNome(request.clienteNome().trim());
        nota.setClienteDocumento(documentoCliente);
        nota.setDescricao(request.descricao().trim());
        nota.setValor(request.valor());
        nota.setEmitidaEm(LocalDateTime.now(FUSO));

        return NotaFiscalResponse.from(notas.save(nota));
    }

    @Transactional(readOnly = true)
    public List<NotaFiscalResponse> listar() {
        return notas.findAllByOrderByEmitidaEmDesc().stream()
                .map(NotaFiscalResponse::from)
                .toList();
    }

    private String proximoNumero(int ano) {
        SequenciaAnual sequencia = sequencias.findByAno(ano).orElseGet(() -> new SequenciaAnual(ano));
        long proximo = sequencia.proximo();
        sequencias.save(sequencia);
        return String.format("%d%06d", ano, proximo);
    }
}
