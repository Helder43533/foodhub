import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
  Store
} from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DELIVERY_FEE = 100;
const ESTIMATED_DELIVERY_TIME = "30 a 45 minutos";

function formatCurrency(value) {
  return `${Number(value).toLocaleString("pt-MZ")} MT`;
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, restaurantName } = useCart();
  const { token, user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO_ENTREGA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const totalFinal = subtotal + deliveryFee;

  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("foodhub_profile") || "{}"
    );

    if (savedProfile.address) {
      setDeliveryAddress(savedProfile.address);
    }
  }, []);

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

    if (!deliveryAddress.trim()) {
      setError("Informe o endereço de entrega.");
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <CheckCircle size={38} />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
              Carrinho vazio
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
            Finalização
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
            Finalizar pedido
          </h1>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Confirme os dados de entrega, escolha a forma de pagamento e envie o
            pedido ao restaurante.
          </p>
        </section>

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dados do pedido
            </h2>

            {restaurantName && (
              <div className="mt-4 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 p-4 rounded-2xl">
                Este pedido será enviado para o restaurante:{" "}
                <strong>{restaurantName}</strong>
              </div>
            )}

            {deliveryAddress && (
              <div className="mt-4 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-4 rounded-2xl text-sm">
                O endereço padrão do teu perfil foi preenchido automaticamente.
              </div>
            )}

            {error && (
              <div className="mt-5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <MapPin size={18} className="text-orange-600" />
                  Endereço de entrega
                </label>

                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Maputo, Bairro Central, Rua..."
                  rows="5"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <CreditCard size={18} className="text-orange-600" />
                  Forma de pagamento
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="DINHEIRO_ENTREGA">Dinheiro na entrega</option>
                  <option value="TRANSFERENCIA">Transferência</option>
                  <option value="MULTICAIXA_SIMULADO">
                    Multicaixa simulado
                  </option>
                </select>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/40 p-5 rounded-2xl text-sm text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">
                  Nota:
                </strong>{" "}
                o pagamento é apenas simulado para fins académicos. Nenhuma
                transacção real será realizada.
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

          <aside className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm h-fit border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Resumo
            </h2>

            {restaurantName && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Store size={17} className="text-orange-600" />
                Restaurante:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {restaurantName}
                </span>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="font-extrabold text-orange-600 whitespace-nowrap">
                    {formatCurrency(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Truck size={16} />
                  Taxa de entrega
                </span>
                <strong>{formatCurrency(deliveryFee)}</strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  Tempo estimado
                </span>
                <strong>{ESTIMATED_DELIVERY_TIME}</strong>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Total final
                </p>
                <p className="text-3xl font-extrabold text-orange-600">
                  {formatCurrency(totalFinal)}
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-5 block w-full text-center bg-orange-50 dark:bg-orange-950/40 text-orange-600 py-3 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/60 font-semibold"
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