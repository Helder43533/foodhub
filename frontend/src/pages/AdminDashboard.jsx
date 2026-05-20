import { useEffect, useState } from "react";
import { Users, Store, Utensils, ShoppingBag, DollarSign } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      setError(
        err.response?.data?.message || "Erro ao carregar dados do administrador."
      );
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

      setMessage(
        isActive
          ? "Restaurante activado com sucesso."
          : "Restaurante suspenso com sucesso."
      );

      loadAdminData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao actualizar estado do restaurante."
      );
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500">
              Esta página é permitida apenas para administradores.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const restaurantsUsers = users.filter((item) => item.role === "RESTAURANTE");

  const cards = [
    {
      title: "Utilizadores",
      value: stats?.users?.total || 0,
      icon: <Users />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Restaurantes",
      value: stats?.restaurants?.total || 0,
      icon: <Store />,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Pratos",
      value: stats?.dishes?.total || 0,
      icon: <Utensils />,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Pedidos",
      value: stats?.orders?.total || 0,
      icon: <ShoppingBag />,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Total vendido",
      value: (stats?.sales?.total || 0) + " MZN",
      icon: <DollarSign />,
      color: "bg-yellow-50 text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Administração
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Painel do administrador
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Bem-vindo, {user?.name}. Aqui pode gerir utilizadores, restaurantes
            e acompanhar os pedidos do sistema.
          </p>
        </section>

        {loading && (
          <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-slate-500">Carregando dados...</p>
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

        {!loading && !error && (
          <>
            <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white p-6 rounded-3xl shadow-sm"
                >
                  <div
                    className={
                      "w-12 h-12 rounded-2xl flex items-center justify-center " +
                      card.color
                    }
                  >
                    {card.icon}
                  </div>

                  <p className="mt-5 text-sm text-slate-500">{card.title}</p>

                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </h2>
                </div>
              ))}
            </section>

            <section className="mt-8 bg-white rounded-3xl shadow-sm p-6">
              <div className="flex flex-wrap gap-3 border-b border-slate-100 pb-4">
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={
                    "px-5 py-2 rounded-xl font-semibold " +
                    (activeTab === "restaurants"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                  }
                >
                  Restaurantes
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={
                    "px-5 py-2 rounded-xl font-semibold " +
                    (activeTab === "users"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                  }
                >
                  Utilizadores
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={
                    "px-5 py-2 rounded-xl font-semibold " +
                    (activeTab === "orders"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                  }
                >
                  Pedidos
                </button>
              </div>

              {activeTab === "restaurants" && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
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
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-4 pr-4">{item.restaurant?.id || "-"}</td>

                          <td className="py-4 pr-4 font-semibold text-slate-900">
                            {item.restaurant?.name || "Ainda não cadastrou"}
                          </td>

                          <td className="py-4 pr-4">{item.name}</td>

                          <td className="py-4 pr-4">{item.email}</td>

                          <td className="py-4 pr-4">
                            {item.restaurant ? (
                              item.restaurant.isActive ? (
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Activo
                                </span>
                              ) : (
                                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Pendente/Suspenso
                                </span>
                              )
                            ) : (
                              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
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
                                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 font-semibold"
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
                                  className="bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 font-semibold"
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
                      <tr className="text-left text-slate-500 border-b">
                        <th className="py-3 pr-4">ID</th>
                        <th className="py-3 pr-4">Nome</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Tipo</th>
                        <th className="py-3 pr-4">Restaurante</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-4 pr-4">{item.id}</td>

                          <td className="py-4 pr-4 font-semibold text-slate-900">
                            {item.name}
                          </td>

                          <td className="py-4 pr-4">{item.email}</td>

                          <td className="py-4 pr-4">
                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.role}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
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
                    <p className="text-slate-500">Nenhum pedido encontrado.</p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-slate-100 rounded-2xl p-5"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              Pedido #{order.id}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Cliente: {order.user?.name || "Não informado"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Estado: {order.status}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Pagamento: {order.payment?.method || "Não informado"}
                            </p>
                          </div>

                          <p className="text-2xl font-extrabold text-orange-600">
                            {order.total} MZN
                          </p>
                        </div>

                        <div className="mt-4 space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm border-t pt-2"
                            >
                              <span>
                                {item.dish.name} — {item.quantity}x
                              </span>

                              <span className="font-semibold">
                                {item.price * item.quantity} MZN
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
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