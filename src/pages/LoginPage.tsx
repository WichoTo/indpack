// src/components/LoginPage.tsx
import React, { useState,  FormEvent } from "react";
import { images } from "../config/variables";
import "../styles/global.css";
import "../styles/loginPage.css";
import FooterContainer from "../components/general/Footer";
import { loginWithEmail,  resetPassword } from "../config/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Spinner from "../components/general/Spinner";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { error } = await loginWithEmail(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate("/inicio");
    }
    setLoading(false);
  };



  const handlePasswordReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Ingresa tu correo para recuperar tu contraseña.");
      return;
    }
    const { error } = await resetPassword(email);
    if (error) {
      setError("Error al enviar el correo de recuperación.");
    } else {
      setMessage("📧 Revisa tu correo para cambiar tu contraseña.");
    }
  };

  return (
    <>
    {loading && <Spinner open={loading} />}
    <div className="mainContainer">
      <div className="contentContainerLogin">
        <div className="letreroContainer">
          <div className="welcome-banner">
            <img src={images.logo} alt="Logo" className="logo" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="loginForm">
          <div className="inputContainer">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="inputContainer">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="error-message" style={{ color: "var(--primary-color)" }}>
              {error}
            </p>
          )}
          {message && (
            <p className="success-message" style={{ color: "green" }}>
              {message}
            </p>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              mt: 1,
              mb: 2,
              "&:hover": { backgroundColor: "var(--secondary-color)" },
            }}
          >
            Iniciar sesión
          </Button>

          <div style={{ marginBottom: "1rem" }}>
            <a
              onClick={handlePasswordReset}
              style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}
            >
              Recuperar Contraseña
            </a>
          </div>
        </form>
      </div>
      <FooterContainer />
    </div>
    </>
  );
};

export default LoginPage;
