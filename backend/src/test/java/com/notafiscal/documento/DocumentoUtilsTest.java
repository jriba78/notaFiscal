package com.notafiscal.documento;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DocumentoUtilsTest {

    @Test
    void aceitaCnpjConhecido() {
        assertTrue(DocumentoUtils.cnpjValido("11222333000181"));
    }

    @Test
    void rejeitaCnpjComDigitoErrado() {
        assertFalse(DocumentoUtils.cnpjValido("11222333000180"));
    }

    @Test
    void aceitaCpfConhecido() {
        assertTrue(DocumentoUtils.cpfValido("52998224725"));
    }

    @Test
    void rejeitaSequenciaRepetida() {
        assertFalse(DocumentoUtils.cnpjValido("00000000000000"));
        assertFalse(DocumentoUtils.cpfValido("11111111111"));
    }
}
