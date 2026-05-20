import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ManageCategories() {
  const { token, user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: "Bearer " + token
  };

  const loadCategories = async () => {
    try {
      setPageLoading(true);

      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Erro ao carregar categorias.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Digite o nome da categoria.");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/categories",
        {
          name: name.trim()
        },
        {
          headers
        }
      );

      setMessage("Categoria criada com sucesso.");
      setName("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500">
              Esta página é permitida apenas para administradores.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Administração
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Gestão de categorias
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Adicione novas categorias para organizar melhor os pratos dos restaurantes.
          </p>
        </section>

        {message && (
          <div className="mt-8 bg-green-50 text-green-700 p-4 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-3xl shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-slate-900">
              Nova categoria
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Nome da categoria
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Pizza"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-semibold"
              >
                {loading ? "Salvando..." : "Adicionar categoria"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-7 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Categorias cadastradas
            </h2>

            {pageLoading ? (
              <p className="mt-6 text-slate-500">Carregando categorias...</p>
            ) : categories.length === 0 ? (
              <p className="mt-6 text-slate-500">
                Nenhuma categoria cadastrada ainda.
              </p>
            ) : (
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100"
                  >
                    <p className="font-bold text-slate-900">
                      {category.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      ID: {category.id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ManageCategories;