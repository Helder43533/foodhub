import { Link } from "react-router-dom";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  GraduationCap,
  Heart,
  Globe
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center">
                <Utensils size={25} />
              </div>

              <h2 className="text-3xl font-extrabold text-white">
                Food<span className="text-orange-500">Hub</span>
              </h2>
            </Link>

            <p className="mt-5 text-sm text-slate-400 leading-7">
              Plataforma web para pedidos de comida online, aproximando clientes
              e restaurantes numa experiência simples, moderna e organizada.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition font-bold"
                title="Facebook"
              >
                f
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition font-bold"
                title="Instagram"
              >
                ig
              </a>

              <a
                href="https://github.com/Helder43533/foodhub"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                title="GitHub"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg">
              Links rápidos
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Início
                </Link>
              </li>

              <li>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Restaurantes
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Sobre o sistema
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Ajuda
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Carrinho
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <ArrowRight size={15} />
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg">
              Categorias populares
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>Pizza</li>
              <li>Hambúrguer</li>
              <li>Comida caseira</li>
              <li>Bebidas</li>
              <li>Sobremesas</li>
              <li>Grelhados</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg">Contacto</h3>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Maputo, Moçambique</span>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>+258 84 000 0000</span>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>info@foodhub.com</span>
              </li>
            </ul>

            <div className="mt-6 bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-start gap-3">
                <GraduationCap
                  size={22}
                  className="text-orange-500 shrink-0 mt-0.5"
                />

                <p className="text-sm text-slate-400 leading-6">
                  Sistema desenvolvido para projecto académico de Programação
                  Web, usando frontend e backend modernos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-7 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">
          <p>© {currentYear} FoodHub. Todos os direitos reservados.</p>

          <p className="flex items-center gap-2">
            Desenvolvido por <b>Hélder Manuel Binala</b>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;