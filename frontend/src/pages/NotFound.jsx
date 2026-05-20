import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-32 max-w-4xl mx-auto px-6 py-16">
        <section className="bg-white rounded-3xl shadow-sm p-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <SearchX size={44} />
          </div>

          <h1 className="mt-8 text-6xl font-extrabold text-slate-900">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Página não encontrada
          </h2>

          <p className="mt-4 text-slate-600 max-w-xl mx-auto">
            A página que tentou acessar não existe ou foi removida. Volte para a
            página inicial e continue a navegar no FoodHub.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
          >
            <Home size={18} />
            Voltar ao início
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;