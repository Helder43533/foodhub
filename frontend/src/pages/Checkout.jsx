import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, CreditCard, CheckCircle } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, total, clearCart, restaurantName } = useCart();
  const { token, user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO_ENTREGA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (user.role !== "CLIENTE") {
      setError("Apenas clientes podem finalizar pedidos.");
      return;
    }

    if (cartItems.length === 0) {
      setError("O carrinho está vazio.");
      return;
    }

    try {
      setLoading(true);

      const items = cartItems.map((item) => ({
        dishId: item.id,
        quantity: item.quantity
      }));

      await api.post(
        "/orders",
        {
          deliveryAddress,
          paymentMethod,
          items
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao finalizar pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <CheckCircle size={38} />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Carrinho vazio
            </h1>

            <p className="mt-3 text-slate-500">
              Adicione pratos antes de finalizar o pedido.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 inline-block bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
            >
              Ver restaurantes
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Finalização
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Finalizar pedido
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Confirme os dados de entrega, escolha a forma de pagamento e envie o
            pedido ao restaurante.
          </p>
        </section>

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-7 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Dados do pedido
            </h2>

            {restaurantName && (
              <div className="mt-4 bg-orange-50 text-orange-700 p-4 rounded-2xl">
                Este pedido será enviado para o restaurante:{" "}
                <strong>{restaurantName}</strong>
              </div>
            )}

            {error && (
              <div className="mt-5 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={18} className="text-orange-600" />
                  Endereço de entrega
                </label>

                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Maputo, Bairro Central, Rua..."
                  rows="5"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CreditCard size={18} className="text-orange-600" />
                  Forma de pagamento
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="DINHEIRO_ENTREGA">Dinheiro na entrega</option>
                  <option value="TRANSFERENCIA">Transferência</option>
                  <option value="MULTICAIXA_SIMULADO">
                    Multicaixa simulado
                  </option>
                </select>
              </div>

              <div className="bg-orange-50 p-5 rounded-2xl text-sm text-slate-700">
                <strong className="text-slate-900">Nota:</strong> o pagamento é
                apenas simulado para fins académicos. Nenhuma transacção real será
                realizada.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-semibold"
              >
                {loading ? "Finalizando..." : "Confirmar pedido"}
              </button>
            </form>
          </div>

          <aside className="bg-white p-7 rounded-3xl shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-slate-900">Resumo</h2>

            {restaurantName && (
              <p className="mt-2 text-sm text-slate-500">
                Restaurante:{" "}
                <span className="font-semibold text-slate-700">
                  {restaurantName}
                </span>
              </p>
            )}

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="font-extrabold text-orange-600 whitespace-nowrap">
                    {item.price * item.quantity} MZN
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 flex justify-between items-center">
              <p className="font-semibold text-slate-900">Total</p>
              <p className="text-3xl font-extrabold text-orange-600">
                {total} MZN
              </p>
            </div>

            <Link
              to="/cart"
              className="mt-5 block w-full text-center bg-orange-50 text-orange-600 py-3 rounded-xl hover:bg-orange-100 font-semibold"
            >
              Voltar ao carrinho
            </Link>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;