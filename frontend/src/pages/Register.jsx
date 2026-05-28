import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Utensils,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENTE"
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (formData.password.length < 6) {
      const msg = "A senha deve ter pelo menos 6 caracteres.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      const successMessage = "Conta criada com sucesso. Faça login para continuar.";

      setMessage(successMessage);
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Erro ao criar conta. Tente novamente.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-200 dark:bg-orange-950/40 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-100 dark:bg-slate-800 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <section className="hidden lg:block">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-600 font-bold mb-8 hover:text-orange-700"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-10">
            <div className="w-16 h-16 rounded-3xl bg-orange-600 text-white flex items-center justify-center">
              <Utensils size={32} />
            </div>

            <h1 className="mt-8 text-5xl font-extrabold text-slate-900 dark:text-white">
              Crie a sua conta no FoodHub
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-8">
              Cadastre-se como cliente para fazer pedidos ou como restaurante
              para publicar pratos e receber encomendas online.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-950/40 rounded-2xl p-5">
                <p className="text-2xl font-extrabold text-orange-600">
                  Cliente
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Ver restaurantes, escolher pratos e fazer pedidos.
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/40 rounded-2xl p-5">
                <p className="text-2xl font-extrabold text-orange-600">
                  Restaurante
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Cadastrar restaurante, pratos e gerir pedidos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-900 w-full p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <Link
                to="/"
                className="mx-auto w-16 h-16 rounded-3xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-2xl"
              >
                F
              </Link>

              <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                Criar conta
              </h1>

              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Cadastre-se para usar o FoodHub
              </p>
            </div>

            {message && (
              <div className="mt-6 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-300 p-4 rounded-2xl text-sm border border-green-100 dark:border-green-900">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Nome
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Digite o seu nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Senha
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-12 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Crie uma senha"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Use pelo menos 6 caracteres.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Tipo de conta
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="RESTAURANTE">Restaurante</option>
                  </select>
                </div>
              </div>

              {formData.role === "RESTAURANTE" && (
                <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 p-4 rounded-2xl text-sm">
                  Depois de criar a conta, cadastre os dados do restaurante e
                  aguarde aprovação do administrador.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-bold flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="text-orange-600 font-bold hover:text-orange-700"
              >
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;