import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-orange-600">
          FoodHub
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
            Início
          </Link>

          <Link to="/restaurants" className="text-slate-700 dark:text-slate-200 hover:text-orange-600">
            Restaurantes
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

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/cart"
            className="relative w-10 h-10 rounded-full bg-orange-50 dark:bg-slate-800 text-orange-600 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
          >
            <ShoppingCart size={20} />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full">
                <User size={16} className="text-slate-600 dark:text-slate-300" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user.name}
                </span>
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
      </div>
    </header>
  );
}

export default Navbar;