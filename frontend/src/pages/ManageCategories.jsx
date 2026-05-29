import { useEffect, useMemo, useState } from "react";
import {
  Tags,
  Plus,
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ArrowLeft,
  FolderOpen,
  Loader2,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ManageCategories() {
  const { token, user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    Authorization: "Bearer " + token
  };

  const loadCategories = async () => {
    try {
      setError("");
      setPageLoading(true);

      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (err) {
      const message = "Erro ao carregar categorias.";
      setError(message);
      toast.error(message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return categories
      .filter((category) => category.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchTerm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const categoryName = name.trim();

    if (!categoryName) {
      const message = "Digite o nome da categoria.";
      setError(message);
      toast.error(message);
      return;
    }

    const alreadyExists = categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (alreadyExists) {
      const message = "Esta categoria já existe.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/categories",
        {
          name: categoryName
        },
        {
          headers
        }
      );

      toast.success("Categoria criada com sucesso.");
      setName("");
      loadCategories();
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao criar categoria.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Esta página é permitida apenas para administradores.
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
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={18} />
          Voltar ao painel admin
        </Link>

        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
                <Tags size={18} />
                Administração
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                Gestão de categorias
              </h1>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                Adicione categorias para organizar melhor os pratos dos
                restaurantes dentro do FoodHub.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl min-w-40">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total
                </p>

                <p className="mt-2 text-3xl font-extrabold text-orange-600">
                  {categories.length}
                </p>
              </div>

              <button
                onClick={loadCategories}
                className="bg-orange-600 text-white p-5 rounded-3xl min-w-40 hover:bg-orange-700 flex flex-col items-start justify-center"
              >
                <RefreshCcw size={22} />
                <span className="mt-2 font-bold">Actualizar</span>
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-2xl border border-red-100 dark:border-red-900 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm h-fit border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Plus size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
              Nova categoria
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Crie categorias como Pizza, Bebidas, Sobremesas, Grelhados e
              outras.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Nome da categoria
                </label>

                <div className="relative">
                  <Tags
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Pizza"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Adicionar categoria
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 p-4 rounded-2xl text-sm flex gap-3">
              <CheckCircle size={19} className="shrink-0 mt-0.5" />
              <p>
                As categorias criadas aqui aparecem no cadastro dos pratos dos
                restaurantes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="text-orange-600" size={25} />
                  Categorias cadastradas
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Lista de categorias disponíveis no sistema.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-11 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Pesquisar categoria..."
                />

                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {pageLoading ? (
              <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-4 h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    <div className="mt-3 h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="mt-8 bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-700">
                <FolderOpen
                  size={42}
                  className="mx-auto text-slate-400 dark:text-slate-500"
                />

                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  Nenhuma categoria encontrada
                </h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "Tente pesquisar por outro nome."
                    : "Crie a primeira categoria no formulário ao lado."}
                </p>
              </div>
            ) : (
              <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                        <Tags size={22} />
                      </div>

                      <span className="text-xs font-bold bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>

                    <p className="mt-5 font-extrabold text-slate-900 dark:text-white text-lg">
                      {category.name}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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