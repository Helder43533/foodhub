import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const {
  cartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  total,
  restaurantName
} = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Carrinho de compras
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Meu carrinho
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Confira os pratos escolhidos antes de finalizar o pedido.
          </p>
        </section>

        {cartItems.length === 0 ? (
          <section className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              O carrinho está vazio
            </h2>

            <p className="mt-3 text-slate-500">
              Adicione pratos de um restaurante para continuar.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 inline-block bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
            >
              Ver restaurantes
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center text-4xl">
                      🍲
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {item.name}
                      </h2>

                      <p className="text-orange-600 font-bold mt-1">
                        {item.price} MZN
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-full px-3 py-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-bold min-w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right min-w-28">
                      <p className="font-extrabold text-slate-900">
                        {item.price * item.quantity} MZN
                      </p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-sm mt-2 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white p-6 rounded-3xl shadow-sm h-fit">
              <h2 className="text-xl font-bold text-slate-900">
                Resumo do pedido
              </h2>

              {restaurantName && (
                <p className="mt-2 text-sm text-slate-500">
                  Restaurante:{" "}
                  <span className="font-semibold text-slate-700">
                    {restaurantName}
                  </span>
                </p>
              )}

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Itens</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span>A definir</span>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-orange-600">
                    {total} MZN
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full text-center bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold"
              >
                Finalizar pedido
              </Link>

              <button
              onClick={() => {
                const confirmClear = window.confirm("Deseja limpar todo o carrinho?");
                if (confirmClear) {
                  clearCart();
                }
              }}
              className="mt-3 block w-full text-center bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 font-semibold"
            >
              Limpar carrinho
            </button>
              <Link
                to="/restaurants"
                className="mt-3 block w-full text-center bg-orange-50 text-orange-600 py-3 rounded-xl hover:bg-orange-100 font-semibold"
              >
                Continuar comprando
              </Link>
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;