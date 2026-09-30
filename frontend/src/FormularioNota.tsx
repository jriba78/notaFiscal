import type { FormEvent, ReactNode } from "react";
import { mascararCnpj, mascararCpfOuCnpj, mascararValor } from "./documento";
import type { ErrosCampos, Formulario } from "./tipos";

type Props = {
  valores: Formulario;
  erros: ErrosCampos;
  enviando: boolean;
  onChange: (campo: keyof Formulario, valor: string) => void;
  onSubmit: () => void;
  onExemplo: () => void;
};

export function FormularioNota({
  valores,
  erros,
  enviando,
  onChange,
  onSubmit,
  onExemplo,
}: Props) {
  function enviar(evento: FormEvent) {
    evento.preventDefault();
    onSubmit();
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <fieldset>
        <legend>Emitente</legend>
        <Campo
          id="emitenteRazaoSocial"
          label="Razão social"
          erro={erros.emitenteRazaoSocial}
        >
          <input
            id="emitenteRazaoSocial"
            name="emitenteRazaoSocial"
            autoComplete="organization"
            maxLength={120}
            value={valores.emitenteRazaoSocial}
            aria-invalid={Boolean(erros.emitenteRazaoSocial)}
            onChange={(evento) => onChange("emitenteRazaoSocial", evento.target.value)}
          />
        </Campo>
        <Campo id="emitenteCnpj" label="CNPJ" erro={erros.emitenteCnpj}>
          <input
            id="emitenteCnpj"
            name="emitenteCnpj"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00.000.000/0000-00"
            value={valores.emitenteCnpj}
            aria-invalid={Boolean(erros.emitenteCnpj)}
            onChange={(evento) => onChange("emitenteCnpj", mascararCnpj(evento.target.value))}
          />
        </Campo>
      </fieldset>

      <fieldset>
        <legend>Cliente</legend>
        <Campo id="clienteNome" label="Nome" erro={erros.clienteNome}>
          <input
            id="clienteNome"
            name="clienteNome"
            autoComplete="name"
            maxLength={120}
            value={valores.clienteNome}
            aria-invalid={Boolean(erros.clienteNome)}
            onChange={(evento) => onChange("clienteNome", evento.target.value)}
          />
        </Campo>
        <Campo
          id="clienteDocumento"
          label="CPF ou CNPJ"
          erro={erros.clienteDocumento}
        >
          <input
            id="clienteDocumento"
            name="clienteDocumento"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            value={valores.clienteDocumento}
            aria-invalid={Boolean(erros.clienteDocumento)}
            onChange={(evento) =>
              onChange("clienteDocumento", mascararCpfOuCnpj(evento.target.value))
            }
          />
        </Campo>
      </fieldset>

      <fieldset>
        <legend>Serviço</legend>
        <Campo id="descricao" label="Descrição" erro={erros.descricao}>
          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            maxLength={500}
            value={valores.descricao}
            aria-invalid={Boolean(erros.descricao)}
            onChange={(evento) => onChange("descricao", evento.target.value)}
          />
        </Campo>
        <div className="grade">
          <Campo
            id="valor"
            label="Valor"
            erro={erros.valor}
            dica="Os dois últimos dígitos são os centavos."
          >
            <input
              id="valor"
              name="valor"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0,00"
              value={valores.valor}
              aria-invalid={Boolean(erros.valor)}
              onChange={(evento) => onChange("valor", mascararValor(evento.target.value))}
            />
          </Campo>
          <Campo id="dataEmissao" label="Data de emissão" erro={erros.dataEmissao}>
            <input
              id="dataEmissao"
              name="dataEmissao"
              type="date"
              value={valores.dataEmissao}
              aria-invalid={Boolean(erros.dataEmissao)}
              onChange={(evento) => onChange("dataEmissao", evento.target.value)}
            />
          </Campo>
        </div>
      </fieldset>

      <div className="acoes">
        <button className="primario" type="submit" disabled={enviando}>
          {enviando ? "Emitindo…" : "Emitir nota fiscal"}
        </button>
        <button className="secundario" type="button" onClick={onExemplo} disabled={enviando}>
          Preencher exemplo
        </button>
      </div>
    </form>
  );
}

function Campo({
  id,
  label,
  erro,
  dica,
  children,
}: {
  id: string;
  label: string;
  erro?: string;
  dica?: string;
  children: ReactNode;
}) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {children}
      {dica ? <p className="dica">{dica}</p> : null}
      {erro ? (
        <p className="erro" id={`${id}-erro`} role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
