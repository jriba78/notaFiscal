package com.notafiscal.api;

import java.util.Map;

public record ErroResponse(String mensagem, Map<String, String> campos) {
}
