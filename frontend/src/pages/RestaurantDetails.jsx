import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function RestaurantDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const response = await api.get("/restaurants/" + id);
        setRestaurant(response.data);
      } catch (err) {
        setError("Erro ao carregar dados do restaurante.");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [id]);

  const handleAddToCart = (dish) => {
    const dishWithRestaurant = {
      ...dish,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      },
      restaurantId: restaurant.id
    };

    const result = addToCart(dishWithRestaurant);

    setSuccessMessage(result.message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2200);
  };

  const getDishImage = (dish) => {
    if (dish.imageUrl && dish.imageUrl.trim() !== "") {
      return dish.imageUrl;
    }

    const categoryName = dish.category?.name?.toLowerCase() || "";
    const dishName = dish.name?.toLowerCase() || "";

    if (categoryName.includes("pizza") || dishName.includes("pizza")) {
      return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80";
    }

    if (
      categoryName.includes("hamb") ||
      dishName.includes("hamb") ||
      dishName.includes("burger")
    ) {
      return "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80";
    }

    if (
      categoryName.includes("bebida") ||
      dishName.includes("sumo") ||
      dishName.includes("suco") ||
      dishName.includes("bebida")
    ) {
      return "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80";
    }

    if (
      categoryName.includes("salada") ||
      dishName.includes("salada") ||
      categoryName.includes("saud")
    ) {
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80";
    }

    if (dishName.includes("frango")) {
      return "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80";
    }

    if (
      dishName.includes("arroz") ||
      dishName.includes("caril") ||
      categoryName.includes("caseira")
    ) {
      return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80";
    }

    if (
      dishName.includes("massa") ||
      dishName.includes("esparguete") ||
      dishName.includes("macarr")
    ) {
      return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80";
    }

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 flex items-center justify-center">
          <p className="text-slate-500">Carregando restaurante...</p>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 flex items-center justify-center px-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-red-600">
              {error || "Restaurante não encontrado."}
            </p>

            <Link to="/restaurants" className="text-orange-600 mt-4 inline-block">
              Voltar aos restaurantes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const availableDishes = restaurant.dishes
    ? restaurant.dishes.filter((dish) => dish.isAvailable)
    : [];

  const categories = [
    ...new Set(
      availableDishes
        .map((dish) => dish.category?.name)
        .filter((categoryName) => categoryName)
    )
  ];

  const filteredDishes = availableDishes
    .filter((dish) => {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        dish.name?.toLowerCase().includes(term) ||
        dish.description?.toLowerCase().includes(term) ||
        dish.category?.name?.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "" || dish.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return b.id - a.id;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="relative overflow-hidden bg-white rounded-3xl shadow-sm">
          <div className="h-64 relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Restaurante activo
              </span>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white">
                {restaurant.name}
              </h1>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-slate-900">
                Sobre o restaurante
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                {restaurant.description || "Restaurante disponível no FoodHub."}
              </p>
            </div>

            <div className="bg-orange-50 p-5 rounded-2xl">
              <h3 className="font-bold text-slate-900">Informações</h3>

              <p className="mt-3 text-sm text-slate-600">
                📍 {restaurant.address || "Endereço não informado"}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                ☎️ {restaurant.phone || "Contacto não informado"}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                🍽️ {availableDishes.length} prato(s) disponível(is)
              </p>
            </div>
          </div>
        </section>

        {successMessage && (
          <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-xl">
            {successMessage}
          </div>
        )}

        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Pratos disponíveis
              </h2>

              <p className="mt-2 text-slate-600">
                Pesquise, filtre e escolha os pratos que deseja adicionar ao carrinho.
              </p>
            </div>

            <Link
              to="/cart"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 text-center"
            >
              Ver carrinho
            </Link>
          </div>

          <div className="mt-6 bg-white p-5 rounded-3xl shadow-sm">
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
                  className="w-full border border-slate-300 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Pesquisar prato, descrição ou categoria..."
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full border border-slate-300 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todas as categorias</option>

                  {categories.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recent">Mais recentes</option>
                <option value="name">Nome A-Z</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              {filteredDishes.length} prato(s) encontrado(s).
            </p>
          </div>

          {availableDishes.length === 0 ? (
            <div className="mt-6 bg-white p-8 rounded-2xl shadow-sm text-center">
              <p className="text-slate-500">
                Este restaurante ainda não possui pratos disponíveis.
              </p>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="mt-6 bg-white p-8 rounded-2xl shadow-sm text-center">
              <p className="text-slate-500">
                Nenhum prato encontrado com os filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="h-44 bg-orange-100 relative overflow-hidden">
                    <img
                      src={getDishImage(dish)}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {dish.name}
                      </h3>

                      {dish.category && (
                        <span className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full font-semibold">
                          {dish.category.name}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                      {dish.description || "Sem descrição."}
                    </p>

                    <p className="mt-5 text-2xl font-extrabold text-orange-600">
                      {dish.price} MZN
                    </p>

                    <button
                      onClick={() => handleAddToCart(dish)}
                      className="mt-5 w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold"
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default RestaurantDetails;