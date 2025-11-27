import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserFromToken } from "../components/auth";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./Vantagens.css";
import { useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";

const API_URL = "http://localhost:8000/api";

const Vantagens = () => {
  const navigate = useNavigate();
  const [vantagens, setVantagens] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();
  const [userInfo, setUserInfo] = useState(null);

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

  const EMAILJS_SERVICE = "service_xyynlic";
  const TEMPLATE_RECEIVER = "template_1e6je2d";
  const EMAILJS_PUBLIC_KEY = "Q2o_F6PwmmVq2sz9q";

  
  const enviarEmailVantagem = (vantagem) => {
  emailjs.send(
    EMAILJS_SERVICE,
    TEMPLATE_RECEIVER,
    {
      to_email: userInfo.email,
      name: userInfo.name,
      time: new Date().toLocaleString(),
      vantagem_nome: vantagem.nome,
      vantagem_valor: vantagem.custo_moedas,
      vantagem_image: `http://localhost:8000${vantagem.foto}`,
    },
    EMAILJS_PUBLIC_KEY
  )
  .then(() => {
    console.log("📧 Email enviado com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao enviar email:", err);
  });
};

  // Buscar saldo e vantagens ao carregar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vantRes, saldoRes] = await Promise.all([
          fetch(`${API_URL}/vantagens/`),
          fetch(`${API_URL}/saldo/?id=${user.id}`)
        ]);

        const vantagensData = await vantRes.json();
        const saldoData = await saldoRes.json();

        const vantagensNaoCompradas = vantagensData.filter(v => !v.comprado);

        setVantagens(vantagensNaoCompradas);
        setSaldo(saldoData.saldo);
      } catch (err) {
        console.error("Erro ao carregar vantagens:", err);
        Swal.fire("Erro", "Não foi possível carregar as vantagens.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleComprar = async (vantagemId, custo) => {

    if (!userInfo) {
      Swal.fire("Aguarde", "Carregando informações do usuário...", "info");
      return;
    }

    if (saldo < custo) {
      Swal.fire("Saldo insuficiente", "Você não tem moedas suficientes.", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/vantagens/${vantagemId}/comprar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
    });

      const data = await res.json();

      
      if (res.ok ) {
        const vantagemComprada = vantagens.find(v => v.id === vantagemId);
        Swal.fire("Compra realizada!", data.message, "success");
        setSaldo(data.novo_saldo);
        setVantagens((prev) => prev.filter((v) => v.id !== vantagemId));

         if (vantagemComprada) {
          enviarEmailVantagem(vantagemComprada);
         }
      } else {
        Swal.fire("Erro", data.message || "Falha ao realizar compra.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Erro", "Não foi possível completar a compra.", "error");
    }
  };

  if (loading) {
    return (
      <div className="vantagens-loading">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="vantagens-container">
        <div className="vantagens-header">
  <h1 className="vantagens-titulo">Vantagens Disponíveis</h1>

  {saldo !== null && (
    <div className="saldo-container">
      <div className="saldo-box bg-dark text-light p-3 rounded shadow-sm">
        <strong>Saldo atual:</strong>
        <span>{Number(saldo).toFixed(2)} moedas</span>
      </div>

      <button
        className="btn-minhas-vantagens"
        onClick={() => navigate("/minhas-vantagens")}
      >
        <i className="bi bi-gift me-2"></i> Minhas Vantagens
      </button>
    </div>
  )}
</div>
        <section className="vantagens-grid">
          {vantagens.length === 0 ? (
            <p>Nenhuma vantagem cadastrada ainda.</p>
          ) : (
            vantagens.map((v) => (
              <div className="vantagem-card" key={v.id}>
                <img
                    src={v.foto}
                    alt={v.nome}
                    className="vantagem-foto"
                    />
                <div className="vantagem-info">
                  <h3>{v.nome}</h3>
                  <p className="descricao">{v.descricao}</p>
                  <p className="custo">
                    Custo: <strong>{v.custo_moedas} moedas</strong>
                  </p>
                  <button
                    className="btn-comprar"
                    onClick={() => handleComprar(v.id, parseFloat(v.custo_moedas))}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
};

export default Vantagens;
