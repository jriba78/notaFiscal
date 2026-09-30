import { useEffect, useState } from "react";
import { ErroValidacao, gerarNota, listarNotas } from "./api";
import {
  cnpjValido,
  cpfOuCnpjValido,
  formatarMoeda,
  formatarNumero,
  hojeIso,
  mascararCnpj,
  mascararCpfOuCnpj,
  valorParaNumero,
} from "./documento";
import { FolhaNota } from "./FolhaNota";
import { FormularioNota } from "./FormularioNota";
import type { ErrosCampos, Formulario, NotaEmitida } from "./tipos";

const formularioVazio = (): Formulario => ({
  emitenteRazaoSocial: "",
  emitenteCnpj: "",
  clienteNome: "",
  clienteDocumento: "",
  descricao: "",
  valor: "",
  dataEmissao: hojeIso(),
});

export function App() {
  const [valores, setValores] = useState<Formulario>(formularioVazio);
  const [erros, setErros] = useState<ErrosCampos>({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [notas, setNotas] = useState<NotaEmitida[]>([]);
  const [notaAberta, setNotaAberta] = useState<NotaEmitida | null>(null);
  const [recemEmitida, setRecemEmitida] = useState(false);

  useEffect(() => {
    listarNotas()
      .then(setNotas)
      .catch(() => setErroGeral("Não foi possível carregar as notas já emitidas."));
  }, []);

  function alterar(campo: keyof Formulario, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
    setNotaAberta(null);
    setRecemEmitida(false);
  }

  function preencherExemplo() {
    setValores({
      emitenteRazaoSocial: "Aurora Serviços Ltda",
      emitenteCnpj: mascararCnpj("11222333000181"),
      clienteNome: "Marina Costa",
      clienteDocumento: mascararCpfOuCnpj("52998224725"),
      descricao: "Consultoria financeira referente ao mês corrente.",
      valor: "1.500,00",
      dataEmissao: hojeIso(),
    });
    setErros({});
    setErroGeral(null);
    setNotaAberta(null);
    setRecemEmitida(false);
  }

  async function emitir() {
    const validacao = validar(valores);
    setErros(validacao);
    setErroGeral(null);
    if (Object.keys(validacao).length > 0) {
      return;
    }

    const valor = valorParaNumero(valores.valor);
    if (valor == null) {
      return;
    }

    setEnviando(true);
    try {
      const nota = await gerarNota({
        emitenteRazaoSocial: valores.emitenteRazaoSocial.trim(),
        emitenteCnpj: valores.emitenteCnpj,
        clienteNome: valores.clienteNome.trim(),
        clienteDocumento: valores.clienteDocumento,
        descricao: valores.descricao.trim(),
        valor,
        dataEmissao: valores.dataEmissao,
      });
      setNotas((atual) => [nota, ...atual.filter((item) => item.id !== nota.id)]);
      setNotaAberta(nota);
      setRecemEmitida(true);
      document.getElementById("folha")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (erro) {
      if (erro instanceof ErroValidacao) {
        setErros(erro.campos as ErrosCampos);
        setErroGeral(erro.message);
      } else {
        setErroGeral("Não foi possível falar com o servidor. Verifique se o backend está em execução.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="app">
      <aside className="trilho">
        <div className="marca">
          <span className="selo-marca" aria-hidden="true">
            N
          </span>
          <div>
            <strong>Emissor</strong>
            <span>Notas fiscais</span>
          </div>
        </div>
        <p className="item-ativo">Emitir nota</p>
      </aside>

      <main className="conteudo">
        <header className="topo">
          <p className="kicker">Operação</p>
          <h1>Gerar nota fiscal</h1>
          <p className="resumo">
            Informe emitente, cliente, descrição, valor e data. O número é atribuído na emissão.
          </p>
        </header>

        {erroGeral ? (
          <p className="aviso" role="alert">
            {erroGeral}
          </p>
        ) : null}

        <div className="mesa">
          <section className="coluna" aria-label="Dados da nota">
            <FormularioNota
              valores={valores}
              erros={erros}
              enviando={enviando}
              onChange={alterar}
              onSubmit={() => void emitir()}
              onExemplo={preencherExemplo}
            />
          </section>

          <section className="coluna" id="folha" aria-label="Documento">
            <FolhaNota nota={notaAberta} rascunho={valores} recemEmitida={recemEmitida} />
            <Historico
              notas={notas}
              selecionadaId={notaAberta?.id ?? null}
              onSelecionar={(nota) => {
                setNotaAberta(nota);
                setRecemEmitida(false);
                setErroGeral(null);
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function Historico({
  notas,
  selecionadaId,
  onSelecionar,
}: {
  notas: NotaEmitida[];
  selecionadaId: number | null;
  onSelecionar: (nota: NotaEmitida) => void;
}) {
  return (
    <section className="historico" aria-label="Notas emitidas">
      <h2>Emitidas</h2>
      {notas.length === 0 ? (
        <p className="vazio-lista">Nenhuma nota emitida ainda.</p>
      ) : (
        <ul>
          {notas.map((nota) => (
            <li key={nota.id}>
              <button
                type="button"
                className={nota.id === selecionadaId ? "ativa" : ""}
                onClick={() => onSelecionar(nota)}
              >
                <span>{formatarNumero(nota.numero)}</span>
                <span>{nota.clienteNome}</span>
                <strong>{formatarMoeda(nota.valor)}</strong>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function validar(valores: Formulario): ErrosCampos {
  const erros: ErrosCampos = {};
  if (!valores.emitenteRazaoSocial.trim()) {
    erros.emitenteRazaoSocial = "Informe a razão social do emitente";
  }
  if (!cnpjValido(valores.emitenteCnpj)) {
    erros.emitenteCnpj = "CNPJ do emitente inválido";
  }
  if (!valores.clienteNome.trim()) {
    erros.clienteNome = "Informe o nome do cliente";
  }
  if (!cpfOuCnpjValido(valores.clienteDocumento)) {
    erros.clienteDocumento = "CPF ou CNPJ do cliente inválido";
  }
  if (!valores.descricao.trim()) {
    erros.descricao = "Informe a descrição do serviço ou produto";
  }
  const valor = valorParaNumero(valores.valor);
  if (valor == null || valor <= 0) {
    erros.valor = "O valor deve ser maior que zero";
  }
  if (!valores.dataEmissao) {
    erros.dataEmissao = "Informe a data de emissão";
  }
  return erros;
}
