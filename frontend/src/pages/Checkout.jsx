import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
  Store,
  AlertCircle,
  X
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

function getPaymentLabel(paymentMethod) {
  if (paymentMethod === "DINHEIRO_ENTREGA") return "Dinheiro na entrega";
  if (paymentMethod === "TRANSFERENCIA") return "Transferência";
  if (paymentMethod === "MULTICAIXA_SIMULADO") return "Multicaixa simulado";

  return paymentMethod;
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, restaurantName } = useCart();
  const { token, user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO_ENTREGA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

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

  const validateOrder = () => {
    setError("");

    if (!user || !token) {
      navigate("/login");
      return false;
    }

    if (user.role !== "CLIENTE") {
      setError("Apenas clientes podem finalizar pedidos.");
      return false;
    }

    if (cartItems.length === 0) {
      setError("O carrinho está vazio.");
      return false;
    }

    if (!deliveryAddress.trim()) {
      setError("Informe o endereço de entrega.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateOrder();

    if (!isValid) {
      return;
    }

    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setShowConfirm(false);

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

    toast.success("Pedido realizado com sucesso.");

    clearCart();
    navigate("/my-orders");

    } catch (err) {
      const message = err.response?.data?.message || "Erro ao finalizar pedido.";

      setError(message);
toast.error(message);
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

      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Confirmar pedido
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Revise os dados antes de enviar.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Restaurante
                  </span>
                  <strong className="text-right">
                    {restaurantName || "Restaurante"}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Pagamento
                  </span>
                  <strong className="text-right">
                    {getPaymentLabel(paymentMethod)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Itens
                  </span>
                  <strong>{cartItems.length}</strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Endereço
                  </span>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/40 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega</span>
                  <strong>{formatCurrency(deliveryFee)}</strong>
                </div>

                <div className="border-t border-orange-200 dark:border-orange-900 pt-3 flex justify-between text-lg">
                  <span className="font-extrabold">Total final</span>
                  <strong className="text-orange-600">
                    {formatCurrency(totalFinal)}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmOrder}
                  disabled={loading}
                  className="bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700 disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Checkout;