import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Unauthorized), redirecionar para login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("@GuiaAlunoEAD:user");
      localStorage.removeItem("@GuiaAlunoEAD:token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
