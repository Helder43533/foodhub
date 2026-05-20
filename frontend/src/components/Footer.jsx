import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-orange-500">
              FoodHub
            </h2>

            <p className="mt-4 text-sm text-slate-400 leading-6">
              Plataforma web para pedidos de comida online, aproximando clientes
              e restaurantes numa experiência simples, moderna e organizada.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg">Links rápidos</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-500">
                  Início
                </Link>
              </li>

              <li>
                <Link to="/restaurants" className="hover:text-orange-500">
                  Restaurantes
                </Link>
              </li>

              <li>
                <Link to="/cart" className="hover:text-orange-500">
                  Carrinho
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-orange-500">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg">Categorias</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>Pizza</li>
              <li>Hambúrguer</li>
              <li>Comida caseira</li>
              <li>Bebidas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg">Contacto</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>Maputo, Moçambique</li>
              <li>+258 84 000 0000</li>
              <li>info@foodhub.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-3">
          <p>© {new Date().getFullYear()} FoodHub. Todos os direitos reservados.</p>
          <p>Desenvolvido para projecto académico de Programação Web.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;