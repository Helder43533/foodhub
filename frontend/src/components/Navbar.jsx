import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold text-orange-600"
        >
          FoodHub
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
            Início
          </Link>

          <Link to="/restaurants" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
            Restaurantes
          </Link>
          <Link to="/about" className="text-slate-700 dark:text-slate-200 hover:text-orange-600" >
            Sobre
          </Link>

          {user?.role === "CLIENTE" && (
            <Link to="/my-orders" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
              Meus pedidos
            </Link>
          )}

          {user?.role === "RESTAURANTE" && (
            <>
              <Link
                to="/restaurant-dashboard"
                className="text-slate-700 dark:text-slate-200 hover:text-orange-600"
              >
                Painel
              </Link>

              <Link
                to="/manage-dishes"
                className="text-slate-700 dark:text-slate-200 hover:text-orange-600"
              >
                Meus pratos
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
                Administração
              </Link>

              <Link
                to="/admin/categories"
                className="text-slate-700 dark:text-slate-200 hover:text-orange-600"
              >
                Categorias
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative w-10 h-10 rounded-full bg-orange-50 dark:bg-slate-800 text-orange-600 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
          >
            <ShoppingCart size={20} />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full">
                  <User size={16} className="text-slate-600 dark:text-slate-300" />

                <Link
                to="/profile"
                className="font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-600"
              >
                {user?.name}
              </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-slate-900 dark:bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-orange-700 flex items-center gap-2 text-sm"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-200 hover:text-orange-600 text-sm font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 text-sm font-medium"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="px-4 py-5 space-y-3">
            {user && (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <User size={18} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={closeMenu}
              className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
            >
              Início
            </Link>

            <Link
              to="/restaurants"
              onClick={closeMenu}
              className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
            >
              Restaurantes
            </Link>
            <Link to="/about" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600">
              Sobre
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
            >
              Carrinho ({totalItems})
            </Link>

            {user?.role === "CLIENTE" && (
              <Link
                to="/my-orders"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
              >
                Meus pedidos
              </Link>
            )}

            {user?.role === "RESTAURANTE" && (
              <>
                <Link
                  to="/restaurant-dashboard"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  Painel
                </Link>

                <Link
                  to="/manage-dishes"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  Meus pratos
                </Link>

                <Link
                  to="/create-restaurant"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  Cadastrar restaurante
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  Administração
                </Link>

                <Link
                  to="/admin/categories"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  Categorias
                </Link>
              </>
            )}

            {!user ? (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="text-center bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold"
                >
                  Criar conta
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;