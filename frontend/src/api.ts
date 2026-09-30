import type { NotaEmitida } from "./tipos";

export class ErroValidacao extends Error {
  campos: Record<string, string>;

  constructor(mensagem: string, campos: Record<string, string>) {
    super(mensagem);
    this.campos = campos;
  }
}

export type GerarNotaPayload = {
  emitenteRazaoSocial: string;
  emitenteCnpj: string;
  clienteNome: string;
  clienteDocumento: string;
  descricao: string;
  valor: number;
  dataEmissao: string;
};

export async function listarNotas(): Promise<NotaEmitida[]> {
  const resposta = await fetch("/api/notas-fiscais");
  if (!resposta.ok) {
    throw new Error("Falha ao carregar notas");
  }
  return resposta.json() as Promise<NotaEmitida[]>;
}

export async function gerarNota(payload: GerarNotaPayload): Promise<NotaEmitida> {
  const resposta = await fetch("/api/notas-fiscais", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (resposta.status === 400) {
    const corpo = (await resposta.json()) as {
      mensagem?: string;
      campos?: Record<string, string>;
    };
    throw new ErroValidacao(
      corpo.mensagem ?? "Revise os campos obrigatórios",
      corpo.campos ?? {},
    );
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível emitir a nota fiscal");
  }

  return resposta.json() as Promise<NotaEmitida>;
}
