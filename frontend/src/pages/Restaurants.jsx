import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Store } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyWithDishes, setOnlyWithDishes] = useState(false);
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

  const filteredRestaurants = restaurants.filter((restaurant) => {
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
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
              Restaurantes parceiros
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
              Escolha onde deseja fazer o seu pedido
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Pesquise restaurantes disponíveis, veja pratos e faça a sua
              encomenda de forma simples e organizada.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white p-5 rounded-3xl shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full border border-slate-300 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Pesquisar por nome, descrição ou endereço..."
              />
            </div>

            <label className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithDishes}
                onChange={(event) => setOnlyWithDishes(event.target.checked)}
                className="w-5 h-5 accent-orange-600"
              />

              <span className="font-medium text-slate-700">
                Apenas com pratos
              </span>
            </label>
          </div>

          {!loading && (
            <p className="mt-4 text-sm text-slate-500">
              {filteredRestaurants.length} restaurante(s) encontrado(s).
            </p>
          )}
        </section>

        {loading && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500">Carregando restaurantes...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Store size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Nenhum restaurante encontrado
            </h2>

            <p className="mt-3 text-slate-500">
              Tente pesquisar por outro nome, endereço ou remova o filtro de pratos.
            </p>
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition group"
            >
              <div className="h-44 bg-orange-100 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                <span className="absolute bottom-4 left-4 bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Aberto
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {restaurant.name}
                </h2>

                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {restaurant.description || "Restaurante disponível no FoodHub."}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <p>📍 {restaurant.address || "Endereço não informado"}</p>
                  <p>☎️ {restaurant.phone || "Contacto não informado"}</p>
                  <p>
                    🍽️ {restaurant.dishes?.length || 0} prato(s) cadastrado(s)
                  </p>
                </div>

                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="mt-6 inline-block w-full text-center bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold"
                >
                  Ver pratos
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Restaurants;