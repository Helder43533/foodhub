import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setError("Apenas utilizadores do tipo restaurante podem cadastrar restaurante.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/restaurants", formData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      navigate("/restaurant-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao cadastrar restaurante."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-4xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Cadastro do restaurante
          </span>

          <h1 className="mt-5 text-4xl font-extrabold text-slate-900">
            Criar restaurante
          </h1>

          <p className="mt-4 text-slate-600">
            Antes de receber pedidos, cadastre as informações do seu restaurante.
          </p>

          {error && (
            <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Nome do restaurante
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Restaurante Estrela"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Descrição
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Especializado em comida caseira e pratos rápidos."
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Endereço
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Maputo, Bairro Central"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Telefone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 840000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-semibold"
            >
              {loading ? "Cadastrando..." : "Cadastrar restaurante"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CreateRestaurant;