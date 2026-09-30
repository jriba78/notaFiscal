package com.notafiscal.nota;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GerarNotaRequest(
        @NotBlank(message = "Informe a razão social do emitente")
        @Size(max = 120, message = "A razão social deve ter no máximo 120 caracteres")
        String emitenteRazaoSocial,

        @NotBlank(message = "Informe o CNPJ do emitente")
        String emitenteCnpj,

        @NotBlank(message = "Informe o nome do cliente")
        @Size(max = 120, message = "O nome do cliente deve ter no máximo 120 caracteres")
        String clienteNome,

        @NotBlank(message = "Informe o CPF ou CNPJ do cliente")
        String clienteDocumento,

        @NotBlank(message = "Informe a descrição do serviço ou produto")
        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
        String descricao,

        @NotNull(message = "Informe o valor")
        @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
        @Digits(integer = 13, fraction = 2, message = "O valor deve ter no máximo duas casas decimais")
        BigDecimal valor,

        @NotNull(message = "Informe a data de emissão")
        LocalDate dataEmissao
) {
}
