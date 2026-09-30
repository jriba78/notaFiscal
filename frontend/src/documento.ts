const PESOS_CNPJ_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function mascararCnpj(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 14);
  return digitos
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function mascararCpfOuCnpj(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 14);
  if (digitos.length <= 11) {
    return digitos
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  return mascararCnpj(digitos);
}

export function mascararValor(valor: string): string {
  const digitos = somenteDigitos(valor).replace(/^0+/, "").slice(0, 13);
  if (!digitos) {
    return "";
  }
  const inteiro = digitos.slice(0, -2) || "0";
  const centavos = digitos.slice(-2).padStart(2, "0");
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${comMilhar},${centavos}`;
}

export function valorParaNumero(mascarado: string): number | null {
  if (!mascarado.trim()) {
    return null;
  }
  const numero = Number(mascarado.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

export function cnpjValido(valor: string): boolean {
  const digitos = somenteDigitos(valor);
  if (digitos.length !== 14 || todosIguais(digitos)) {
    return false;
  }
  const primeiro = digito(digitos.slice(0, 12), PESOS_CNPJ_1);
  const segundo = digito(digitos.slice(0, 12) + primeiro, PESOS_CNPJ_2);
  return digitos.endsWith(`${primeiro}${segundo}`);
}

export function cpfOuCnpjValido(valor: string): boolean {
  const digitos = somenteDigitos(valor);
  if (digitos.length === 11) {
    return cpfValido(digitos);
  }
  if (digitos.length === 14) {
    return cnpjValido(digitos);
  }
  return false;
}

export function hojeIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) {
    return "—";
  }
  return `${dia}/${mes}/${ano}`;
}

export function formatarNumero(numero: string): string {
  if (numero.length <= 4) {
    return numero;
  }
  return `${numero.slice(0, 4)}.${numero.slice(4)}`;
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function cpfValido(digitos: string): boolean {
  if (todosIguais(digitos)) {
    return false;
  }
  const primeiro = digitoCpf(digitos, 9);
  const segundo = digitoCpf(digitos, 10);
  return digitos.endsWith(`${primeiro}${segundo}`);
}

function digitoCpf(digitos: string, tamanho: number): number {
  let soma = 0;
  let peso = tamanho + 1;
  for (let i = 0; i < tamanho; i += 1) {
    soma += Number(digitos[i]) * peso;
    peso -= 1;
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function digito(base: string, pesos: number[]): number {
  const soma = pesos.reduce((total, peso, indice) => total + Number(base[indice]) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function todosIguais(digitos: string): boolean {
  return digitos.split("").every((digitoAtual) => digitoAtual === digitos[0]);
}
