import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./TransferirMoedas.css";
import { getUserFromToken } from "./auth";

const API_ALUNOS = "http://localhost:8000/api/alunos/";
const API_TRANSFERIR = "http://localhost:8000/api/transferir/";

const TransferirMoedas = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  
const user = getUserFromToken();

console.log("Usuário logado:", user);


  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await fetch(API_ALUNOS);
        console.log(res)
        if (!res.ok) throw new Error("Falha ao carregar alunos");
        const data = await res.json();
        console.log(data);
        setAlunos(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar lista de alunos");
      }
    };
    fetchAlunos();
  }, []);

useEffect(() => {
  if (!busca.trim()) {
    setSugestoes([]);
    return;
  }

  console.log("🟢 Digitando:", busca);
  console.log("👥 Alunos carregados:", alunos.length);

  const filtrados = alunos.filter(a => {
    const nome = a.perfil_detalhes.user.username || "";
    return (
      nome.toLowerCase().includes(busca.toLowerCase()) 
    );
  });

  console.log("💡 Sugestões:", filtrados);
  setSugestoes(filtrados.slice(0, 5));
}, [busca, alunos]);

  const handleSelecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setBusca(aluno.perfil_detalhes.user.username );
    setSugestoes([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alunoSelecionado || !valor) {
      setError("Selecione um aluno e informe um valor válido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        remetente_id: user.id,
        destinatario_id: alunoSelecionado.id,
        valor: parseFloat(valor),
      };


        const res = await fetch(API_TRANSFERIR, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        });

      if (!res.ok) {
        let msg = "Falha na transferência.";
        try {
          const err = await res.json();
          msg = Object.values(err)[0] || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();

      Swal.fire({
        icon: "success",
        title: "Transferência realizada!",
        text: `Você enviou ${valor} moedas para ${alunoSelecionado.perfil?.user?.username || "o aluno"}.`,
      });

      setAlunoSelecionado(null);
      setBusca("");
      setValor("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transfer-form">
      <h2>Transferir Moedas</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group autocomplete">
        <label>Aluno destino</label>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite o nome do aluno..."
          required
        />
        {sugestoes.length > 0 && (
          <ul className="suggestion-list">
            {sugestoes.map((a) => (
              <li key={a.id} onClick={() => handleSelecionarAluno(a)}>
                {a.perfil_detalhes.user.username }
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-group">
        <label>Quantidade de moedas</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Transferindo..." : "Enviar"}
      </button>
    </form>
  );
};

export default TransferirMoedas;
