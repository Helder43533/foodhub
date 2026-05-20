import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENTE"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      setMessage("Conta criada com sucesso. Faça login para continuar.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-orange-600 text-center">
          Criar conta
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Cadastre-se para usar o FoodHub
        </p>

        {message && (
          <div className="mt-5 bg-green-50 text-green-600 p-3 rounded-xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Digite o seu nome"
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tipo de conta
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="RESTAURANTE">Restaurante</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-orange-600 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;