import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // normalmente o SimpleJWT coloca o "user_id" e "username" no payload
    return {
      id: decoded.user_id,
      username: decoded.username || decoded.email || "Desconhecido"
    };
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}
