import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  Clock,
  Truck,
  XCircle,
  Store,
  Utensils
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  if (!user || user.role !== "RESTAURANTE") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500">
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
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Painel do restaurante
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Gestão de pedidos
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Bem-vindo, {user?.name}. Aqui pode acompanhar os pedidos recebidos e
            gerir o seu restaurante.
          </p>
        </section>

        {loading && (
          <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-slate-500">Carregando painel...</p>
          </div>
        )}

        {message && (
          <div className="mt-8 bg-green-50 text-green-700 p-4 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !myRestaurant && (
          <section className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Store size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Conclua o cadastro do restaurante
            </h2>

            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
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
          <section className="mt-8 bg-yellow-50 border border-yellow-100 p-10 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
              <Clock size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Restaurante aguardando aprovação
            </h2>

            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              O restaurante <strong>{myRestaurant.name}</strong> já foi
              cadastrado, mas ainda precisa ser aprovado pelo administrador para
              ficar visível aos clientes e receber pedidos.
            </p>

            <div className="mt-6 bg-white p-5 rounded-2xl text-left max-w-2xl mx-auto">
              <p className="font-semibold text-slate-900">Dados cadastrados:</p>

              <p className="mt-2 text-sm text-slate-600">
                Nome: {myRestaurant.name}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Endereço: {myRestaurant.address || "Não informado"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Telefone: {myRestaurant.phone || "Não informado"}
              </p>
            </div>
          </section>
        )}

        {!loading &&
          myRestaurant &&
          myRestaurant.isActive &&
          dishes.length === 0 && (
            <section className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Utensils size={38} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Cadastre os pratos do restaurante
              </h2>

              <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
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
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                  <p className="text-sm text-slate-500">Total de pedidos</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                    {totalOrders}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                  <p className="text-sm text-slate-500">Pendentes</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-yellow-600">
                    {pendingOrders}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                  <p className="text-sm text-slate-500">Entregues</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-green-600">
                    {deliveredOrders}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                  <p className="text-sm text-slate-500">Total vendido</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-orange-600">
                    {totalSales} MZN
                  </h2>
                </div>
              </section>

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
                <div className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Nenhum pedido nesta aba
                  </h2>

                  <p className="mt-3 text-slate-500">
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
                        className="bg-white p-6 md:p-7 rounded-3xl shadow-sm"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                          <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">
                              Pedido #{order.id}
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                              Cliente: {order.user?.name || "Não informado"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Email: {order.user?.email || "Não informado"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Endereço:{" "}
                              {order.deliveryAddress || "Não informado"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Pagamento:{" "}
                              {order.payment?.method || "Não informado"}
                            </p>
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
                                className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
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
                              className="flex justify-between gap-4 border-b border-slate-100 pb-4"
                            >
                              <div>
                                <p className="font-bold text-slate-900">
                                  {item.dish.name}
                                </p>

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

export default RestaurantDashboard;