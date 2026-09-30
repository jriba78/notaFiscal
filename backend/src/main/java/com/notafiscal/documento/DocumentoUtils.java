package com.notafiscal.documento;

public final class DocumentoUtils {

    private static final int[] PESOS_CNPJ_PRIMEIRO = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] PESOS_CNPJ_SEGUNDO = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    private DocumentoUtils() {
    }

    public static String somenteDigitos(String valor) {
        if (valor == null) {
            return "";
        }
        return valor.replaceAll("\\D", "");
    }

    public static boolean cnpjValido(String digitos) {
        if (digitos == null || digitos.length() != 14 || todosIguais(digitos)) {
            return false;
        }
        int primeiro = digitoVerificador(digitos.substring(0, 12), PESOS_CNPJ_PRIMEIRO);
        int segundo = digitoVerificador(digitos.substring(0, 12) + primeiro, PESOS_CNPJ_SEGUNDO);
        return digitos.charAt(12) == Character.forDigit(primeiro, 10)
                && digitos.charAt(13) == Character.forDigit(segundo, 10);
    }

    public static boolean cpfValido(String digitos) {
        if (digitos == null || digitos.length() != 11 || todosIguais(digitos)) {
            return false;
        }
        int primeiro = digitoCpf(digitos, 9);
        int segundo = digitoCpf(digitos, 10);
        return digitos.charAt(9) == Character.forDigit(primeiro, 10)
                && digitos.charAt(10) == Character.forDigit(segundo, 10);
    }

    public static boolean cpfOuCnpjValido(String digitos) {
        if (digitos == null) {
            return false;
        }
        return switch (digitos.length()) {
            case 11 -> cpfValido(digitos);
            case 14 -> cnpjValido(digitos);
            default -> false;
        };
    }

    public static String formatarCnpj(String digitos) {
        return digitos.replaceFirst("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
    }

    public static String formatarDocumento(String digitos) {
        if (digitos.length() == 11) {
            return digitos.replaceFirst("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
        }
        if (digitos.length() == 14) {
            return formatarCnpj(digitos);
        }
        return digitos;
    }

    private static int digitoCpf(String digitos, int tamanho) {
        int soma = 0;
        int peso = tamanho + 1;
        for (int i = 0; i < tamanho; i++) {
            soma += Character.digit(digitos.charAt(i), 10) * peso--;
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private static int digitoVerificador(String base, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += Character.digit(base.charAt(i), 10) * pesos[i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private static boolean todosIguais(String digitos) {
        char primeiro = digitos.charAt(0);
        for (int i = 1; i < digitos.length(); i++) {
            if (digitos.charAt(i) != primeiro) {
                return false;
            }
        }
        return true;
    }
}
