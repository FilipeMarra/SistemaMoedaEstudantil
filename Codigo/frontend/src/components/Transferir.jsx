import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./TransferirMoedas.css";
import { getUserFromToken } from "./auth";
import emailjs from '@emailjs/browser';

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
  const [userInfo, setUserInfo] = useState(null);
  const user = getUserFromToken();

useEffect(() => {
  async function loadUser() {
    if (!user?.id) return;

    const res = await fetch(`http://localhost:8000/api/usuarios/${user.id}/`);
    if (res.ok) {
      const perfil = await res.json();
      setUserInfo(perfil);
    } else {
      console.error("Falha ao carregar dados completos do usuário.");
    }
  }

  loadUser();
}, [user]);


const EMAILJS_SERVICE = "service_fx4wgs6";
const TEMPLATE_SENDER = "template_au98h58";
const TEMPLATE_RECEIVER = "template_1phicem";
//const EMAILJS_PUBLIC_KEY = "qSFm1trAXA1yhyu4S";
const EMAILJS_PUBLIC_KEY = "x5JhfuJ7WzZMI5nSv";

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await fetch(API_ALUNOS);
        if (!res.ok) throw new Error("Falha ao carregar alunos");
        const data = await res.json();
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

  const filtrados = alunos.filter(a => {
    const nome = a.perfil_detalhes.user_detalhes.username || "";
    return (
      nome.toLowerCase().includes(busca.toLowerCase()) 
    );
  });

  setSugestoes(filtrados.slice(0, 5));
}, [busca, alunos]);

  const handleSelecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setBusca(aluno.perfil_detalhes.user_detalhes.username );
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
      headers: { "Content-Type": "application/json" },
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

    // ================================
    // ENVIO DE EMAILS APÓS TRANSFERIR
    // ================================
    console.log(userInfo)
    console.log(alunoSelecionado,"aluno")
    await emailjs.send(
      EMAILJS_SERVICE,
      TEMPLATE_SENDER,
      {
        email: userInfo.email,
        to_name: userInfo.username,
        receiver_name: alunoSelecionado.perfil_detalhes.user_detalhes.username,
        amount: valor,
        date: new Date().toLocaleString(),
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log(alunoSelecionado.perfil_detalhes.user_detalhes.email)

    await emailjs.send(
      EMAILJS_SERVICE,
      TEMPLATE_RECEIVER,
      {
        to_email: alunoSelecionado.perfil_detalhes.user_detalhes.email,
        to_name: alunoSelecionado.perfil_detalhes.user_detalhes.username,
        sender_name: userInfo.username,
        amount: valor,
        date: new Date().toLocaleString(),
      },
      EMAILJS_PUBLIC_KEY
    );

    Swal.fire({
      icon: "success",
      title: "Transferência realizada!",
      text: `Você enviou ${valor} moedas para ${alunoSelecionado.perfil_detalhes.user_detalhes.username}.`,
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
                {a.perfil_detalhes?.user_detalhes?.username }
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
