import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  FileText,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle,
  Info
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateRestaurant() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: ""
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

    if (!user || user.role !== "RESTAURANTE") {
      const message =
        "Apenas utilizadores do tipo restaurante podem cadastrar restaurante.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.name.trim()) {
      const message = "Informe o nome do restaurante.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.address.trim()) {
      const message = "Informe o endereço do restaurante.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      await api.post("/restaurants", formData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      toast.success("Restaurante cadastrado com sucesso.");

      navigate("/restaurant-dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao cadastrar restaurante.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "RESTAURANTE") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Esta página é permitida apenas para utilizadores do tipo
              restaurante.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <Link
          to="/restaurant-dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={18} />
          Voltar ao painel
        </Link>

        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
              <Store size={18} />
              Cadastro do restaurante
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Criar restaurante
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Cadastre as informações principais do seu restaurante. Depois do
              cadastro, o administrador deverá aprovar para que fique visível aos
              clientes.
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-7 md:p-8 border border-slate-100 dark:border-slate-800">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold flex items-center gap-2">
                <Store className="text-orange-600" size={25} />
                Dados do restaurante
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Preencha os campos abaixo com atenção.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Nome do restaurante
                </label>

                <div className="relative">
                  <Store
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Restaurante Estrela"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Descrição
                </label>

                <div className="relative">
                  <FileText
                    size={19}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Ex: Especializado em comida caseira e pratos rápidos."
                    rows="4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Endereço
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Maputo, Bairro Central"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Telefone
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: 84 000 0000"
                  />
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 p-5 rounded-2xl text-sm flex gap-3">
                <Info size={21} className="shrink-0 mt-0.5" />
                <p>
                  Depois de cadastrar, o restaurante ficará pendente até ser
                  aprovado pelo administrador. Após aprovação, poderá cadastrar
                  pratos e receber pedidos.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-bold flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? "Cadastrando..." : "Cadastrar restaurante"}
              </button>
            </form>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <CheckCircle className="text-orange-600" size={23} />
                Pré-visualização
              </h2>

              <div className="mt-5 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <div className="h-40 bg-orange-100 dark:bg-orange-950/40 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                    alt="Pré-visualização"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                  <span className="absolute bottom-4 left-4 text-white font-extrabold text-xl">
                    {formData.name || "Nome do restaurante"}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {formData.description ||
                      "Descrição do restaurante aparecerá aqui."}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-orange-600" />
                      {formData.address || "Endereço não informado"}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-orange-600" />
                      {formData.phone || "Contacto não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-3xl p-6 border border-yellow-100 dark:border-yellow-900">
              <h3 className="text-lg font-extrabold text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <Clock size={22} />
                Aguardará aprovação
              </h3>

              <p className="mt-3 text-sm text-yellow-700 dark:text-yellow-300 leading-6">
                O administrador precisa aprovar o restaurante antes que ele
                apareça para clientes.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 rounded-3xl p-6 border border-green-100 dark:border-green-900">
              <h3 className="text-lg font-extrabold text-green-700 dark:text-green-300 flex items-center gap-2">
                <ShieldCheck size={22} />
                Próximo passo
              </h3>

              <p className="mt-3 text-sm text-green-700 dark:text-green-300 leading-6">
                Depois da aprovação, aceda à página “Meus pratos” para cadastrar
                os pratos do restaurante.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CreateRestaurant;