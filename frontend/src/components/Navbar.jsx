import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  User,
  Sun,
  Moon,
  Home,
  Store,
  Info
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `font-semibold transition ${
      isActive
        ? "text-orange-600"
        : "text-slate-700 dark:text-slate-200 hover:text-orange-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition ${
      isActive
        ? "bg-orange-100 text-orange-600 dark:bg-orange-950/40"
        : "text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
            F
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              FoodHub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
              comida online
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Início
          </NavLink>

          <NavLink to="/restaurants" className={linkClass}>
            Restaurantes
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            Sobre
          </NavLink>

          {user?.role === "CLIENTE" && (
            <NavLink to="/my-orders" className={linkClass}>
              Meus pedidos
            </NavLink>
          )}

          {user?.role === "RESTAURANTE" && (
            <>
              <NavLink to="/restaurant/dashboard" className={linkClass}>
                Painel
              </NavLink>

              <NavLink to="/restaurant/dishes" className={linkClass}>
                Meus pratos
              </NavLink>

              <NavLink to="/restaurant/register" className={linkClass}>
                Restaurante
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin" className={linkClass}>
                Administração
              </NavLink>

              <NavLink to="/admin/categories" className={linkClass}>
                Categorias
              </NavLink>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600"
            title="Mudar tema"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {user?.role === "CLIENTE" && (
            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600"
            >
              <ShoppingCart size={20} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-orange-100 hover:text-orange-600"
              >
                <User size={18} />
                <span className="font-bold max-w-[130px] truncate">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 flex items-center justify-center hover:bg-red-100"
                title="Sair"
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600"
              >
                Entrar
              </Link>

              <Link
                to="/register"
                className="bg-orange-600 text-white px-5 py-2 rounded-2xl font-bold hover:bg-orange-700"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-4 pb-5">
          <div className="pt-4 space-y-2">
            <NavLink to="/" onClick={closeMenu} className={mobileLinkClass}>
              <Home size={20} />
              Início
            </NavLink>

            <NavLink
              to="/restaurants"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <Store size={20} />
              Restaurantes
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <Info size={20} />
              Sobre
            </NavLink>

            {user?.role === "CLIENTE" && (
              <>
                <NavLink
                  to="/my-orders"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Meus pedidos
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  <ShoppingCart size={20} />
                  Carrinho
                  {cartCount > 0 && (
                    <span className="ml-auto bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            {user?.role === "RESTAURANTE" && (
              <>
                <NavLink
                  to="/restaurant/dashboard"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Painel do restaurante
                </NavLink>

                <NavLink
                  to="/restaurant/dishes"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Meus pratos
                </NavLink>

                <NavLink
                  to="/restaurant/register"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Cadastrar restaurante
                </NavLink>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Administração
                </NavLink>

                <NavLink
                  to="/admin/categories"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Categorias
                </NavLink>
              </>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <User size={20} />
                    Meu perfil
                  </NavLink>

                  <div className="px-4 py-3 mt-2 rounded-2xl bg-slate-50 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sessão iniciada como
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700"
                  >
                    <LogOut size={19} />
                    Terminar sessão
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold"
                  >
                    Entrar
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center bg-orange-600 text-white py-3 rounded-2xl font-bold"
                  >
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;