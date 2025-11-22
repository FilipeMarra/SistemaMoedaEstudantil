import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        navigate("/dashboard");
      } else {
        setError("Usuário ou senha inválidos!");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="login-wrapper">
      
      {/* LADO ESQUERDO */}
      <div className="login-left">
        <img
          src="../public/img/logo.png"          
          alt="Logo"
          className="login-logo"
        />

        <form className="login-box" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Entrar</button>
        </form>
      </div>

      {/* LADO DIREITO */}
      <div className="login-right">
  <video
    src="/img/login.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="login-video"
  />
</div>

    </div>
  );
};

export default LoginPage;
