import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, Clock, Truck, XCircle } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setOrders(response.data);
    } catch (err) {
      setError("Erro ao carregar os seus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDENTE: {
        label: "Pendente",
        className: "bg-yellow-50 text-yellow-700",
        icon: <Clock size={16} />
      },
      CONFIRMADO: {
        label: "Confirmado",
        className: "bg-blue-50 text-blue-700",
        icon: <PackageCheck size={16} />
      },
      EM_PREPARACAO: {
        label: "Em preparação",
        className: "bg-orange-50 text-orange-700",
        icon: <Clock size={16} />
      },
      A_CAMINHO: {
        label: "A caminho",
        className: "bg-purple-50 text-purple-700",
        icon: <Truck size={16} />
      },
      ENTREGUE: {
        label: "Entregue",
        className: "bg-green-50 text-green-700",
        icon: <PackageCheck size={16} />
      },
      CANCELADO: {
        label: "Cancelado",
        className: "bg-red-50 text-red-700",
        icon: <XCircle size={16} />
      }
    };

    return (
      statusMap[status] || {
        label: status,
        className: "bg-slate-100 text-slate-700",
        icon: <Clock size={16} />
      }
    );
  };

  const openStatuses = ["PENDENTE", "CONFIRMADO", "EM_PREPARACAO", "A_CAMINHO"];
  const finishedStatuses = ["ENTREGUE", "CANCELADO"];

  const openOrders = orders.filter((order) =>
    openStatuses.includes(order.status)
  );

  const finishedOrders = orders.filter((order) =>
    finishedStatuses.includes(order.status)
  );

  const displayedOrders = activeTab === "open" ? openOrders : finishedOrders;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Histórico
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Meus pedidos
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Acompanhe os pedidos em andamento e consulte os pedidos já finalizados.
          </p>
        </section>

        {loading && (
          <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-slate-500">Carregando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <section className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <PackageCheck size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Ainda não fez nenhum pedido
            </h2>

            <p className="mt-3 text-slate-500">
              Explore restaurantes e faça o seu primeiro pedido.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 inline-block bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
            >
              Ver restaurantes
            </Link>
          </section>
        )}

        {!loading && orders.length > 0 && (
          <>
            <section className="mt-8 bg-white p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveTab("open")}
                className={
                  "flex-1 px-5 py-3 rounded-xl font-semibold transition " +
                  (activeTab === "open"
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Pedidos abertos ({openOrders.length})
              </button>

              <button
                onClick={() => setActiveTab("finished")}
                className={
                  "flex-1 px-5 py-3 rounded-xl font-semibold transition " +
                  (activeTab === "finished"
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Finalizados ({finishedOrders.length})
              </button>
            </section>

            {displayedOrders.length === 0 ? (
              <section className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Nenhum pedido nesta aba
                </h2>

                <p className="mt-3 text-slate-500">
                  {activeTab === "open"
                    ? "Não existem pedidos abertos no momento."
                    : "Ainda não existem pedidos finalizados."}
                </p>
              </section>
            ) : (
              <section className="mt-8 space-y-6">
                {displayedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);

                  return (
                    <div
                      key={order.id}
                      className="bg-white p-6 md:p-7 rounded-3xl shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900">
                            Pedido #{order.id}
                          </h2>

                          <p className="mt-2 text-sm text-slate-500">
                            Endereço: {order.deliveryAddress || "Não informado"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Pagamento: {order.payment?.method || "Não informado"}
                          </p>
                        </div>

                        <span
                          className={
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold " +
                            statusInfo.className
                          }
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 border-b border-slate-100 pb-4"
                          >
                            <div>
                              <p className="font-bold text-slate-900">
                                {item.dish.name}
                              </p>

                              <p className="text-sm text-slate-500">
                                Quantidade: {item.quantity}
                              </p>

                              {item.dish.restaurant && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Restaurante: {item.dish.restaurant.name}
                                </p>
                              )}
                            </div>

                            <p className="font-extrabold text-orange-600 whitespace-nowrap">
                              {item.price * item.quantity} MZN
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                        <p className="font-semibold text-slate-700">Total</p>

                        <p className="text-2xl font-extrabold text-orange-600">
                          {order.total} MZN
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyOrders;