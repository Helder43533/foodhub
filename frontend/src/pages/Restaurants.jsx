import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Store,
  MapPin,
  Phone,
  Utensils,
  Clock,
  Truck,
  ArrowRight,
  Filter,
  CheckCircle
} from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DELIVERY_FEE = 100;
const ESTIMATED_TIME = "30 a 45 min";

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
];

function getRestaurantImage(id) {
  const index = Number(id || 0) % restaurantImages.length;
  return restaurantImages[index];
}

function formatCurrency(value) {
  return `${Number(value).toLocaleString("pt-MZ")} MT`;
}

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyWithDishes, setOnlyWithDishes] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRestaurants = async () => {
    try {
      const response = await api.get("/restaurants");
      setRestaurants(response.data);
    } catch (err) {
      setError("Erro ao carregar restaurantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        restaurant.name?.toLowerCase().includes(term) ||
        restaurant.description?.toLowerCase().includes(term) ||
        restaurant.address?.toLowerCase().includes(term);

      const hasDishes = restaurant.dishes && restaurant.dishes.length > 0;

      if (onlyWithDishes) {
        return matchesSearch && hasDishes;
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "dishes") {
        return (b.dishes?.length || 0) - (a.dishes?.length || 0);
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
              <Store size={18} />
              Restaurantes parceiros
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Escolha onde deseja fazer o seu pedido
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Pesquise restaurantes disponíveis, veja pratos e faça a sua
              encomenda de forma simples, rápida e organizada.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Pesquisar por nome, descrição ou endereço..."
              />
            </div>

            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-4 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithDishes}
                onChange={(event) => setOnlyWithDishes(event.target.checked)}
                className="w-5 h-5 accent-orange-600"
              />

              <span className="font-medium text-slate-700 dark:text-slate-200">
                Apenas com pratos
              </span>
            </label>

            <div className="relative">
              <Filter
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Ordenar por nome</option>
                <option value="dishes">Mais pratos cadastrados</option>
              </select>
            </div>
          </div>

          {!loading && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {filteredRestaurants.length} restaurante(s) encontrado(s).
            </p>
          )}
        </section>

        {loading && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse"
              >
                <div className="h-44 bg-slate-200 dark:bg-slate-800" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Store size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Nenhum restaurante encontrado
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Tente pesquisar por outro nome, endereço ou remova o filtro de
              pratos.
            </p>
          </div>
        )}

        {!loading && filteredRestaurants.length > 0 && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const dishesCount = restaurant.dishes?.length || 0;

              return (
                <div
                  key={restaurant.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition group border border-slate-100 dark:border-slate-800"
                >
                  <div className="h-48 bg-orange-100 relative overflow-hidden">
                    <img
                      src={restaurant.imageUrl || getRestaurantImage(restaurant.id)}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/95 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                      <CheckCircle size={15} />
                      Disponível
                    </span>

                    <span className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="block text-xs opacity-90">
                        Restaurante
                      </span>
                      <span className="block text-2xl font-extrabold truncate">
                        {restaurant.name}
                      </span>
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[40px]">
                      {restaurant.description ||
                        "Restaurante disponível no FoodHub."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock size={14} />
                          Tempo
                        </p>
                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {ESTIMATED_TIME}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Truck size={14} />
                          Entrega
                        </p>
                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(DELIVERY_FEE)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="text-orange-600 mt-0.5 shrink-0"
                        />
                        <span>
                          {restaurant.address || "Endereço não informado"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={17} className="text-orange-600 shrink-0" />
                        <span>{restaurant.phone || "Contacto não informado"}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Utensils
                          size={17}
                          className="text-orange-600 shrink-0"
                        />
                        <span>{dishesCount} prato(s) cadastrado(s)</span>
                      </p>
                    </div>

                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="mt-6 w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold flex items-center justify-center gap-2"
                    >
                      Ver menu
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Restaurants;