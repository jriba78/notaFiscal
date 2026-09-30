import { formatarData, formatarMoeda, formatarNumero, valorParaNumero } from "./documento";
import type { Formulario, NotaEmitida } from "./tipos";

type Props = {
  nota: NotaEmitida | null;
  rascunho: Formulario;
  recemEmitida: boolean;
};

export function FolhaNota({ nota, rascunho, recemEmitida }: Props) {
  if (nota) {
    return (
      <article className="folha" aria-live="polite">
        {recemEmitida ? (
          <p className="selo" role="status">
            Nota emitida
          </p>
        ) : (
          <p className="selo selo-arquivo">Nota arquivada</p>
        )}
        <Cabecalho numero={formatarNumero(nota.numero)} data={formatarData(nota.dataEmissao)} />
        <Partes
          emitente={nota.emitenteRazaoSocial}
          cnpj={nota.emitenteCnpj}
          cliente={nota.clienteNome}
          documento={nota.clienteDocumento}
        />
        <p className="descricao">{nota.descricao}</p>
        <p className="valor">{formatarMoeda(nota.valor)}</p>
        <button className="secundario imprimir" type="button" onClick={() => window.print()}>
          Imprimir
        </button>
      </article>
    );
  }

  const valor = valorParaNumero(rascunho.valor);

  return (
    <article className="folha folha-rascunho" aria-live="polite">
      <p className="selo selo-rascunho">Pré-visualização</p>
      <Cabecalho
        numero="Aguardando emissão"
        data={rascunho.dataEmissao ? formatarData(rascunho.dataEmissao) : "—"}
      />
      <Partes
        emitente={rascunho.emitenteRazaoSocial || "Razão social do emitente"}
        cnpj={rascunho.emitenteCnpj || "CNPJ"}
        cliente={rascunho.clienteNome || "Nome do cliente"}
        documento={rascunho.clienteDocumento || "CPF ou CNPJ"}
      />
      <p className={`descricao ${rascunho.descricao ? "" : "vazio"}`}>
        {rascunho.descricao || "A descrição do serviço ou produto aparece aqui."}
      </p>
      <p className="valor">{valor == null ? "R$ 0,00" : formatarMoeda(valor)}</p>
    </article>
  );
}

function Cabecalho({ numero, data }: { numero: string; data: string }) {
  return (
    <header className="folha-topo">
      <div>
        <p className="kicker">Documento</p>
        <h2>Nota fiscal</h2>
      </div>
      <div className="folha-meta">
        <span>Nº {numero}</span>
        <span>{data}</span>
      </div>
    </header>
  );
}

function Partes({
  emitente,
  cnpj,
  cliente,
  documento,
}: {
  emitente: string;
  cnpj: string;
  cliente: string;
  documento: string;
}) {
  return (
    <div className="partes">
      <section>
        <p className="kicker">Emitente</p>
        <strong>{emitente}</strong>
        <span>{cnpj}</span>
      </section>
      <section>
        <p className="kicker">Cliente</p>
        <strong>{cliente}</strong>
        <span>{documento}</span>
      </section>
    </div>
  );
}
