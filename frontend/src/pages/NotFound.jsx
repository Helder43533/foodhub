import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  SearchX,
  ArrowLeft,
  Store,
  HelpCircle,
  Utensils
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-32 max-w-6xl mx-auto px-6 py-16">
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-12 text-center border border-slate-100 dark:border-slate-800">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-slate-100 dark:bg-slate-800 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <SearchX size={52} />
            </div>

            <h1 className="mt-8 text-7xl md:text-8xl font-extrabold text-orange-600">
              404
            </h1>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Página não encontrada
            </h2>

            <p className="mt-5 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-7">
              A página que tentou acessar não existe, foi removida ou o link foi
              digitado de forma incorrecta. Volte para uma página válida e
              continue a navegar no FoodHub.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-7 py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-7 py-4 rounded-2xl hover:bg-orange-700 font-bold"
              >
                <Home size={18} />
                Ir ao início
              </Link>

              <Link
                to="/restaurants"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 font-bold"
              >
                <Store size={18} />
                Ver restaurantes
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            to="/restaurants"
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-orange-200 dark:hover:border-orange-900 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Utensils size={24} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">
              Procurar comida
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Veja os restaurantes disponíveis e escolha os seus pratos.
            </p>
          </Link>

          <Link
            to="/cart"
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-orange-200 dark:hover:border-orange-900 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Store size={24} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">
              Ver carrinho
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Continue o seu pedido se já tiver pratos adicionados.
            </p>
          </Link>

          <Link
            to="/help"
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-orange-200 dark:hover:border-orange-900 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <HelpCircle size={24} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">
              Precisa de ajuda?
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Consulte perguntas frequentes sobre como usar o FoodHub.
            </p>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;