package com.notafiscal.nota;

public class DocumentoInvalidoException extends RuntimeException {

    private final String campo;

    public DocumentoInvalidoException(String campo, String mensagem) {
        super(mensagem);
        this.campo = campo;
    }

    public String getCampo() {
        return campo;
    }
}
