const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;

  // En producción (cualquier dominio distinto a localhost), forzar siempre ruta relativa '/api'
  // si la variable no existe o si apunta accidentalmente a localhost
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
      return "/api";
    }
  }

  return envUrl || "/api";
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
