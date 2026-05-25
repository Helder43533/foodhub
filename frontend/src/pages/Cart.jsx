import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Store,
  Clock,
  Truck
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const DELIVERY_FEE = 100;
const ESTIMATED_DELIVERY_TIME = "30 a 45 minutos";

function formatCurrency(value) {
  return `${Number(value).toLocaleString("pt-MZ")} MT`;
}

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const restaurantName = cartItems[0]?.restaurantName || "Restaurante";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft size={18} />
              Continuar comprando
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  Meu carrinho
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Revise os pratos antes de finalizar o pedido.
                </p>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                <ShoppingCart size={36} />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                O teu carrinho está vazio
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Escolhe um restaurante e adiciona pratos ao carrinho.
              </p>

              <Link
                to="/restaurants"
                className="inline-flex items-center justify-center bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-orange-700"
              >
                Ver restaurantes
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Store size={20} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Pedido de
                      </p>
                      <h2 className="font-bold text-slate-900 dark:text-white">
                        {restaurantName}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={clearCart}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <Trash2 size={17} />
                    Limpar
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row gap-5"
                  >
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-2xl"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </h3>

                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {item.description || "Sem descrição disponível."}
                          </p>

                          <p className="mt-3 font-extrabold text-orange-600">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="self-start text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 p-2 rounded-xl"
                          title="Remover prato"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="font-bold min-w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-slate-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(Number(item.price) * Number(item.quantity))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 space-y-5 sticky top-28">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Resumo do pedido
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <Truck size={16} />
                        Taxa de entrega
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(deliveryFee)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        Tempo estimado
                      </span>
                      <span className="font-semibold">
                        {ESTIMATED_DELIVERY_TIME}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-5 flex justify-between text-lg font-extrabold text-slate-900 dark:text-white">
                      <span>Total final</span>
                      <span className="text-orange-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center"
                  >
                    Finalizar pedido
                  </Link>

                  <Link
                    to="/restaurants"
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
                  >
                    Adicionar mais pratos
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;