import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ResetarSenha.css";
import Swal from 'sweetalert2';

const ResetarSenhaPage = () => {
  const { token } = useParams();

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");

  // Decodificar token -> email
  useEffect(() => {
    try {
      const json = JSON.parse(atob(token));
      setEmail(json.email);
    } catch (e) {
      console.error("Token inválido.");
      setMsg("Link de redefinição inválido.");
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (senha !== confirmar) {
      setMsg("As senhas não conferem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/resetar-senha/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nova_senha: senha
        })
      });

      if (!response.ok) {
        Swal.fire({
            icon: 'error',
            title: 'Senha não alterada!',
            text: `Falha ao alterar a senha`,
            timer: 2000, 
            showConfirmButton: false,
        });
        return;
      }

    Swal.fire({
        icon: 'success',
        title: 'Senha alterada!',
        text: `A vsenha foi alterada com sucesso.`,
        timer: 2000, 
        showConfirmButton: false,
        willClose: () => {
        window.location.href = '/login'
              }
    });

    } catch (err) {
      console.error(err);
      setMsg("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="resetar-wrapper">

      <div className="resetar-left">
        <img src="/img/logo.png" className="resetar-logo" alt="Logo" />

        <form className="resetar-box" onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <button type="submit">Alterar senha</button>

          {msg && <p className="resetar-msg">{msg}</p>}

          <div className="resetar-links">
            <Link to="/login">Voltar ao login</Link>
          </div>
        </form>
      </div>

      <div className="resetar-right">
        <video
          src="/img/login.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="resetar-video"
        />
      </div>

    </div>
  );
};

export default ResetarSenhaPage;
