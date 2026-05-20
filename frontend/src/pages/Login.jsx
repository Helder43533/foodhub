import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      login(response.data.user, response.data.token);

      if (response.data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (response.data.user.role === "RESTAURANTE") {
        navigate("/restaurant-dashboard");
      } else {
        navigate("/restaurants");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-orange-600 text-center">
          Entrar
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Acesse a sua conta FoodHub
        </p>

        {error && (
          <div className="mt-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Digite a sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-orange-600 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;