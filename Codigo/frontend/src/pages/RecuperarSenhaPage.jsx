import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import "../styles/RecuperarSenha.css";

const RecuperarSenhaPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const gerarToken = (email) => {
    const payload = {
        email: email,
        timestamp: Date.now(), 
    };

    const json = JSON.stringify(payload);
    return btoa(json); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = gerarToken(email);

      const resetLink = `http://localhost:5173/resetar-senha/${token}`;

      const templateParams = {
        to_email: email,
        link: resetLink,
      };

      await emailjs.send(
        "service_xyynlic",
        "template_j2myhyp",
        templateParams,
        "Q2o_F6PwmmVq2sz9q"
      );

      setMessage("Um link de recuperação foi enviado ao seu e-mail!");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar o e-mail. Tente novamente.");
    }
  };

  return (
    <div className="login-wrapper">

      {/* LADO ESQUERDO — igual ao login */}
      <div className="login-left">
        <img
          src="../public/img/logo.png"
          alt="Logo"
          className="login-logo"
        />

        <form className="login-box" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Enviar link de recuperação</button>

          {message && <p className="msg">{message}</p>}

          <div className="login-links">
            <Link to="/">Voltar ao login</Link>
          </div>
        </form>
      </div>

      {/* LADO DIREITO — igual ao login */}
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

export default RecuperarSenhaPage;
