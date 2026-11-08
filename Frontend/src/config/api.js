const RAW_API_URL = (process.env.REACT_APP_API_URL || "")
  .trim()
  .replace(/\/api\/?$/, "");

// Si la aplicación corre en producción (dominio fuera de localhost),
// se descarta cualquier URL que apunte a localhost/127.0.0.1 para forzar rutas relativas
const getApiUrl = () => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    (RAW_API_URL.includes("localhost") || RAW_API_URL.includes("127.0.0.1"))
  ) {
    return "";
  }
  return RAW_API_URL;
};

export const API_URL = getApiUrl();
export const API_BASE_URL = `${API_URL}/api`;

export default API_URL;
