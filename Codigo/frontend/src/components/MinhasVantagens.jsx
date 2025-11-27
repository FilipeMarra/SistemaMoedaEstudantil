// src/pages/MinhasVantagens.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserFromToken } from "../components/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";  // ⬅ icons
import "./Vantagens.css";

const API_URL = "http://localhost:8000/api";

const MinhasVantagens = () => {
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiveis, setVisiveis] = useState({});

  const user = getUserFromToken();

  
  const toggleCodigo = (id) => {
    setVisiveis((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
              <img src={v.foto} alt={v.nome} className="vantagem-foto" />

              <div className="vantagem-info">
                <h3>{v.nome}</h3>
                <p className="descricao">{v.descricao}</p>

                <p className="custo">
                  Valor pago: <strong>{v.custo_moedas} moedas</strong>
                </p>

                {/* --- CÓDIGO + ÍCONE --- */}
                <div className="codigo-container">
                  <span className="codigo-label">Código:</span>

                  <span className="codigo-value">
                    {visiveis[v.id] ? v.codigo : "••••••"}
                  </span>

                  <button className="btn-olho" onClick={() => toggleCodigo(v.id)}>
                    {visiveis[v.id] ? (
                      <FiEyeOff size={20} color="#574f4fff" />
                    ) : (
                      <FiEye size={20} color="#574f4fff" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MinhasVantagens;
