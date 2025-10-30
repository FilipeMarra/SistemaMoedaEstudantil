import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // precisa usar username
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
       
        navigate("/dashboard-aluno");
      } else {
        setError("Usuário ou senha inválidos!");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <>
      <Header />
      <main className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <label>
            Usuário:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Senha:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </main>
      <div></div>
    </>
  );
};

export default LoginPage;
