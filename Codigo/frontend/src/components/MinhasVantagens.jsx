// src/pages/MinhasVantagens.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserFromToken } from "../components/auth";
import "./Vantagens.css";

const API_URL = "http://localhost:8000/api";

const MinhasVantagens = () => {
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();

  useEffect(() => {
    const fetchMinhasVantagens = async () => {
      try {
        const res = await fetch(`${API_URL}/vantagens/minhas/?user_id=${user.id}`);
        if (!res.ok) throw new Error("Erro ao carregar vantagens");
        const data = await res.json();
        setVantagens(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível carregar suas vantagens.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMinhasVantagens();
  }, [user.id]);

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
    <main className="vantagens-container">
      <div className="vantagens-header">
        <h1 className="vantagens-titulo">Minhas Vantagens</h1>

      </div>

      <section className="vantagens-grid">
        {vantagens.length === 0 ? (
          <p>Você ainda não resgatou nenhuma vantagem.</p>
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
                  Valor pago: <strong>{v.custo_moedas} moedas</strong>
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MinhasVantagens;
