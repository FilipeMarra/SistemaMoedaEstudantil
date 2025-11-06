import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserFromToken } from "../components/auth";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./Vantagens.css";

const API_URL = "http://localhost:8000/api";

const Vantagens = () => {
  const [vantagens, setVantagens] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();

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

        setVantagens(vantagensData);
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
        Swal.fire("Compra realizada!", data.message, "success");
        setSaldo(data.novo_saldo);
        setVantagens((prev) => prev.filter((v) => v.id !== vantagemId));
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
          <h1>Vantagens Disponíveis</h1>
          {saldo !== null && (
            <div className="saldo-box bg-dark text-light p-3 rounded shadow-sm">
              <strong>Saldo atual: </strong> 
              <span className="text-success">{Number(saldo).toFixed(2)} moedas</span>
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
                    src={`../../../Codigo/backend/media/${v.foto}`}
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
