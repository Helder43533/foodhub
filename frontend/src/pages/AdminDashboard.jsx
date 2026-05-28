import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Utensils,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  RefreshCcw,
  CheckCircle,
  PauseCircle,
  Clock,
  Mail,
  User,
  CreditCard,
  PackageCheck,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("pt-MZ")} MT`;
}

function getRoleLabel(role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "RESTAURANTE") return "Restaurante";
  return "Cliente";
}

function getPaymentLabel(method) {
  if (method === "DINHEIRO_ENTREGA") return "Dinheiro na entrega";
  if (method === "TRANSFERENCIA") return "Transferência";
  if (method === "MULTICAIXA_SIMULADO") return "Multicaixa simulado";

  return method || "Não informado";
}

function getOrderStatusInfo(status) {
  const statusMap = {
    PENDENTE: {
      label: "Pendente",
      className:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
      icon: <Clock size={16} />
    },
    CONFIRMADO: {
      label: "Confirmado",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      icon: <PackageCheck size={16} />
    },
    EM_PREPARACAO: {
      label: "Em preparação",
      className:
        "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
      icon: <Clock size={16} />
    },
    A_CAMINHO: {
      label: "A caminho",
      className:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
      icon: <ShoppingBag size={16} />
    },
    ENTREGUE: {
      label: "Entregue",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
      icon: <PackageCheck size={16} />
    },
    CANCELADO: {
      label: "Cancelado",
      className:
        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
      icon: <XCircle size={16} />
    }
  };

  return (
    statusMap[status] || {
      label: status || "Não informado",
      className:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      icon: <Clock size={16} />
    }
  );
}

function AdminDashboard() {
  const { token, user } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: "Bearer " + token
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsResponse = await api.get("/admin/stats", { headers });
      const usersResponse = await api.get("/admin/users", { headers });
      const ordersResponse = await api.get("/admin/orders", { headers });

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setOrders(ordersResponse.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao carregar dados do administrador.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const updateRestaurantStatus = async (restaurantId, isActive) => {
    try {
      setMessage("");
      setError("");

      await api.patch(
        "/restaurants/" + restaurantId + "/status",
        { isActive },
        { headers }
      );

      const successMessage = isActive
        ? "Restaurante activado com sucesso."
        : "Restaurante suspenso com sucesso.";

      setMessage(successMessage);
      toast.success(successMessage);

      await loadAdminData();

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao actualizar estado do restaurante.";

      setError(message);
      toast.error(message);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Esta página é permitida apenas para administradores.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const restaurantsUsers = users.filter((item) => item.role === "RESTAURANTE");

  const clientsCount = users.filter((item) => item.role === "CLIENTE").length;
  const restaurantsCount = users.filter(
    (item) => item.role === "RESTAURANTE"
  ).length;
  const adminsCount = users.filter((item) => item.role === "ADMIN").length;

  const activeRestaurants = restaurantsUsers.filter(
    (item) => item.restaurant?.isActive
  ).length;

  const pendingRestaurants = restaurantsUsers.filter(
    (item) => item.restaurant && !item.restaurant.isActive
  ).length;

  const cards = [
    {
      title: "Utilizadores",
      value: stats?.users?.total || users.length || 0,
      icon: <Users size={24} />,
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
    },
    {
      title: "Restaurantes",
      value: stats?.restaurants?.total || restaurantsUsers.length || 0,
      icon: <Store size={24} />,
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
    },
    {
      title: "Pratos",
      value: stats?.dishes?.total || 0,
      icon: <Utensils size={24} />,
      color:
        "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300"
    },
    {
      title: "Pedidos",
      value: stats?.orders?.total || orders.length || 0,
      icon: <ShoppingBag size={24} />,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300"
    },
    {
      title: "Total vendido",
      value: formatCurrency(stats?.sales?.total || 0),
      icon: <DollarSign size={24} />,
      color:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
                <ShieldCheck size={18} />
                Administração
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                Painel do administrador
              </h1>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                Bem-vindo, {user?.name}. Aqui pode gerir utilizadores,
                restaurantes e acompanhar os pedidos do sistema.
              </p>
            </div>

            <button
              onClick={loadAdminData}
              className="bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Actualizar painel
            </button>
          </div>
        </section>

        {loading && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Carregando dados...
            </p>
          </div>
        )}

        {message && (
          <div className="mt-8 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-4 rounded-xl border border-green-100 dark:border-green-900">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div
                    className={
                      "w-12 h-12 rounded-2xl flex items-center justify-center " +
                      card.color
                    }
                  >
                    {card.icon}
                  </div>

                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    {card.value}
                  </h2>
                </div>
              ))}
            </section>

            <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Clientes
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-blue-600">
                  {clientsCount}
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Contas restaurante
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-orange-600">
                  {restaurantsCount}
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Administradores
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-purple-600">
                  {adminsCount}
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Restaurantes activos
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-green-600">
                  {activeRestaurants}
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pendentes/Suspensos
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-yellow-600">
                  {pendingRestaurants}
                </h3>
              </div>
            </section>

            <section className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={
                    "flex-1 px-5 py-3 rounded-xl font-semibold transition " +
                    (activeTab === "restaurants"
                      ? "bg-orange-600 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700")
                  }
                >
                  Restaurantes
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={
                    "flex-1 px-5 py-3 rounded-xl font-semibold transition " +
                    (activeTab === "users"
                      ? "bg-orange-600 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700")
                  }
                >
                  Utilizadores
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={
                    "flex-1 px-5 py-3 rounded-xl font-semibold transition " +
                    (activeTab === "orders"
                      ? "bg-orange-600 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700")
                  }
                >
                  Pedidos
                </button>
              </div>

              {activeTab === "restaurants" && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="py-3 pr-4">ID</th>
                        <th className="py-3 pr-4">Restaurante</th>
                        <th className="py-3 pr-4">Dono</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Estado</th>
                        <th className="py-3 pr-4">Acção</th>
                      </tr>
                    </thead>

                    <tbody>
                      {restaurantsUsers.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="py-4 pr-4">
                            {item.restaurant?.id || "-"}
                          </td>

                          <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">
                            {item.restaurant?.name || "Ainda não cadastrou"}
                          </td>

                          <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                            {item.name}
                          </td>

                          <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                            {item.email}
                          </td>

                          <td className="py-4 pr-4">
                            {item.restaurant ? (
                              item.restaurant.isActive ? (
                                <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                                  <CheckCircle size={14} />
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                                  <PauseCircle size={14} />
                                  Pendente/Suspenso
                                </span>
                              )
                            ) : (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                                Sem restaurante
                              </span>
                            )}
                          </td>

                          <td className="py-4 pr-4">
                            {item.restaurant ? (
                              item.restaurant.isActive ? (
                                <button
                                  onClick={() =>
                                    updateRestaurantStatus(
                                      item.restaurant.id,
                                      false
                                    )
                                  }
                                  className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/60 font-semibold"
                                >
                                  Suspender
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    updateRestaurantStatus(
                                      item.restaurant.id,
                                      true
                                    )
                                  }
                                  className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-4 py-2 rounded-xl hover:bg-green-100 dark:hover:bg-green-950/60 font-semibold"
                                >
                                  Activar
                                </button>
                              )
                            ) : (
                              <span className="text-slate-400">
                                Aguardando cadastro
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "users" && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="py-3 pr-4">ID</th>
                        <th className="py-3 pr-4">Nome</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Tipo</th>
                        <th className="py-3 pr-4">Restaurante</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="py-4 pr-4">{item.id}</td>

                          <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">
                            <span className="inline-flex items-center gap-2">
                              <User size={16} className="text-orange-600" />
                              {item.name}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-2">
                              <Mail size={16} className="text-orange-600" />
                              {item.email}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
                            <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                              {getRoleLabel(item.role)}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                            {item.restaurant?.name || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="mt-6 space-y-5">
                  {orders.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400">
                      Nenhum pedido encontrado.
                    </p>
                  ) : (
                    orders.map((order) => {
                      const statusInfo = getOrderStatusInfo(order.status);

                      return (
                        <div
                          key={order.id}
                          className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-slate-50 dark:bg-slate-800/60"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Pedido #{order.id}
                              </h3>

                              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Cliente:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {order.user?.name || "Não informado"}
                                </span>
                              </p>

                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Pagamento:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {getPaymentLabel(order.payment?.method)}
                                </span>
                              </p>

                              <span
                                className={
                                  "mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold " +
                                  statusInfo.className
                                }
                              >
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </div>

                            <p className="text-2xl font-extrabold text-orange-600">
                              {formatCurrency(order.total)}
                            </p>
                          </div>

                          <div className="mt-4 space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-600 dark:text-slate-300"
                              >
                                <span>
                                  {item.dish.name} — {item.quantity}x
                                </span>

                                <span className="font-semibold">
                                  {formatCurrency(
                                    Number(item.price) * Number(item.quantity)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;