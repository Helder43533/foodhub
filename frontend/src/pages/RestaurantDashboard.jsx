import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  Clock,
  Truck,
  XCircle,
  Store,
  Utensils,
  ShoppingBag,
  DollarSign,
  Mail,
  MapPin,
  CreditCard,
  User,
  BarChart3,
  RefreshCcw
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("pt-MZ")} MT`;
}

function RestaurantDashboard() {
  const { token, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("open");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: "Bearer " + token
  };

  const loadRestaurantInfo = async () => {
    const response = await api.get("/restaurants");

    const restaurant = response.data.find(
      (item) => item.owner?.id === user?.id
    );

    if (!restaurant) {
      setMyRestaurant(null);
      setDishes([]);
      return null;
    }

    setMyRestaurant(restaurant);

    const dishesResponse = await api.get("/dishes/restaurant/" + restaurant.id);
    setDishes(dishesResponse.data);

    return restaurant;
  };

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders/restaurant", {
        headers
      });

      setOrders(response.data);
    } catch (err) {
      setOrders([]);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const restaurant = await loadRestaurantInfo();

      if (restaurant && restaurant.isActive) {
        await loadOrders();
      }
    } catch (err) {
      setError("Erro ao carregar dados do painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      loadDashboardData();
    }
  }, [token, user]);

  const updateStatus = async (orderId, status) => {
    try {
      setMessage("");
      setError("");

      await api.patch(
        "/orders/" + orderId + "/status",
        { status },
        { headers }
      );

      setMessage("Estado do pedido actualizado com sucesso.");
      await loadOrders();

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao actualizar estado do pedido."
      );
    }
  };

  const getStatusInfo = (status) => {
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
        icon: <Truck size={16} />
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
        label: status,
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: <Clock size={16} />
      }
    );
  };

  if (!user || user.role !== "RESTAURANTE") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Esta página é permitida apenas para utilizadores do tipo
              restaurante.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const openStatuses = ["PENDENTE", "CONFIRMADO", "EM_PREPARACAO", "A_CAMINHO"];
  const finishedStatuses = ["ENTREGUE", "CANCELADO"];

  const openOrders = orders.filter((order) =>
    openStatuses.includes(order.status)
  );

  const finishedOrders = orders.filter((order) =>
    finishedStatuses.includes(order.status)
  );

  const displayedOrders = activeTab === "open" ? openOrders : finishedOrders;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDENTE"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "ENTREGUE"
  ).length;
  const totalSales = orders
    .filter((order) => order.status !== "CANCELADO")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
                <Store size={18} />
                Painel do restaurante
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                Gestão de pedidos
              </h1>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                Bem-vindo, {user?.name}. Aqui pode acompanhar pedidos recebidos,
                actualizar estados e gerir o funcionamento do seu restaurante.
              </p>
            </div>

            <button
              onClick={loadDashboardData}
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
              Carregando painel...
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

        {!loading && !myRestaurant && (
          <section className="mt-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Store size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Conclua o cadastro do restaurante
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              A sua conta foi criada como restaurante, mas ainda falta cadastrar
              os dados do restaurante para poder publicar pratos e receber
              pedidos.
            </p>

            <Link
              to="/create-restaurant"
              className="mt-6 inline-block bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
            >
              Cadastrar restaurante
            </Link>
          </section>
        )}

        {!loading && myRestaurant && !myRestaurant.isActive && (
          <section className="mt-8 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900 p-10 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 flex items-center justify-center">
              <Clock size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Restaurante aguardando aprovação
            </h2>

            <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              O restaurante <strong>{myRestaurant.name}</strong> já foi
              cadastrado, mas ainda precisa ser aprovado pelo administrador para
              ficar visível aos clientes e receber pedidos.
            </p>

            <div className="mt-6 bg-white dark:bg-slate-900 p-5 rounded-2xl text-left max-w-2xl mx-auto border border-yellow-100 dark:border-yellow-900">
              <p className="font-semibold text-slate-900 dark:text-white">
                Dados cadastrados:
              </p>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Nome: {myRestaurant.name}
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Endereço: {myRestaurant.address || "Não informado"}
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Telefone: {myRestaurant.phone || "Não informado"}
              </p>
            </div>
          </section>
        )}

        {!loading &&
          myRestaurant &&
          myRestaurant.isActive &&
          dishes.length === 0 && (
            <section className="mt-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Utensils size={38} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                Cadastre os pratos do restaurante
              </h2>

              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                O restaurante já está activo, mas ainda não possui pratos
                cadastrados. Cadastre pratos para que os clientes possam fazer
                pedidos.
              </p>

              <Link
                to="/manage-dishes"
                className="mt-6 inline-block bg-orange-600 text-white px-7 py-3 rounded-xl hover:bg-orange-700 font-semibold"
              >
                Cadastrar pratos
              </Link>
            </section>
          )}

        {!loading &&
          myRestaurant &&
          myRestaurant.isActive &&
          dishes.length > 0 && (
            <>
              <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                    Total de pedidos
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    {totalOrders}
                  </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                    Pendentes
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-yellow-600">
                    {pendingOrders}
                  </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
                    <PackageCheck size={24} />
                  </div>
                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                    Entregues
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-green-600">
                    {deliveredOrders}
                  </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                    Total vendido
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-orange-600">
                    {formatCurrency(totalSales)}
                  </h2>
                </div>
              </section>

              <section className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <BarChart3 className="text-orange-600" size={26} />
                      Pedidos recebidos
                    </h2>

                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      Consulte pedidos abertos e finalizados do restaurante.
                    </p>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setActiveTab("open")}
                      className={
                        "px-5 py-3 rounded-xl font-semibold transition " +
                        (activeTab === "open"
                          ? "bg-orange-600 text-white"
                          : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700")
                      }
                    >
                      Pedidos abertos ({openOrders.length})
                    </button>

                    <button
                      onClick={() => setActiveTab("finished")}
                      className={
                        "px-5 py-3 rounded-xl font-semibold transition " +
                        (activeTab === "finished"
                          ? "bg-orange-600 text-white"
                          : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700")
                      }
                    >
                      Finalizados ({finishedOrders.length})
                    </button>
                  </div>
                </div>
              </section>

              {displayedOrders.length === 0 ? (
                <div className="mt-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Nenhum pedido nesta aba
                  </h2>

                  <p className="mt-3 text-slate-500 dark:text-slate-400">
                    {activeTab === "open"
                      ? "Não existem pedidos abertos no momento."
                      : "Ainda não existem pedidos finalizados."}
                  </p>
                </div>
              ) : (
                <section className="mt-8 space-y-6">
                  {displayedOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);

                    return (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-slate-900 p-6 md:p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                          <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                              Pedido #{order.id}
                            </h2>

                            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
                              <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <User size={16} className="text-orange-600" />
                                Cliente:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {order.user?.name || "Não informado"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Mail size={16} className="text-orange-600" />
                                Email:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {order.user?.email || "Não informado"}
                                </span>
                              </p>

                              <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 md:col-span-2">
                                <MapPin
                                  size={16}
                                  className="text-orange-600 mt-0.5"
                                />
                                Endereço:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {order.deliveryAddress || "Não informado"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <CreditCard
                                  size={16}
                                  className="text-orange-600"
                                />
                                Pagamento:{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {order.payment?.method || "Não informado"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 min-w-64">
                            <span
                              className={
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit " +
                                statusInfo.className
                              }
                            >
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>

                            {activeTab === "open" && (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order.id, e.target.value)
                                }
                                className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="PENDENTE">Pendente</option>
                                <option value="CONFIRMADO">Confirmado</option>
                                <option value="EM_PREPARACAO">
                                  Em preparação
                                </option>
                                <option value="A_CAMINHO">A caminho</option>
                                <option value="ENTREGUE">Entregue</option>
                                <option value="CANCELADO">Cancelado</option>
                              </select>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"
                            >
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {item.dish.name}
                                </p>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Quantidade: {item.quantity}
                                </p>
                              </div>

                              <p className="font-extrabold text-orange-600 whitespace-nowrap">
                                {formatCurrency(
                                  Number(item.price) * Number(item.quantity)
                                )}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                          <p className="font-semibold text-slate-700 dark:text-slate-200">
                            Total
                          </p>

                          <p className="text-2xl font-extrabold text-orange-600">
                            {formatCurrency(order.total)}
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

export default RestaurantDashboard;