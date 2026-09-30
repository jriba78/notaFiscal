export type Formulario = {
  emitenteRazaoSocial: string;
  emitenteCnpj: string;
  clienteNome: string;
  clienteDocumento: string;
  descricao: string;
  valor: string;
  dataEmissao: string;
};

export type NotaEmitida = {
  id: number;
  numero: string;
  dataEmissao: string;
  emitenteRazaoSocial: string;
  emitenteCnpj: string;
  clienteNome: string;
  clienteDocumento: string;
  descricao: string;
  valor: number;
  emitidaEm: string;
};

export type ErrosCampos = Partial<Record<keyof Formulario, string>>;
