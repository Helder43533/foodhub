import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Phone,
  Utensils,
  Clock,
  Truck,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Store,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DELIVERY_FEE = 100;
const ESTIMATED_TIME = "30 a 45 min";

function formatCurrency(value) {
  return `${Number(value).toLocaleString("pt-MZ")} MT`;
}

function RestaurantDetails() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartCount =
    cartItems?.reduce((total, item) => total + Number(item.quantity), 0) || 0;

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
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    };

    const result = addToCart(dishWithRestaurant);

    if (result?.success === false) {
      toast.error(result.message || "Não foi possível adicionar ao carrinho.");
      return;
    }

    toast.success(result?.message || "Prato adicionado ao carrinho.");
  };

  const getRestaurantImage = () => {
    if (restaurant?.imageUrl && restaurant.imageUrl.trim() !== "") {
      return restaurant.imageUrl;
    }

    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80";
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

    if (
      dishName.includes("bolo") ||
      dishName.includes("sobremesa") ||
      categoryName.includes("sobremesa")
    ) {
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80";
    }

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse">
            <div className="h-72 bg-slate-200 dark:bg-slate-800" />
            <div className="p-8 space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 flex items-center justify-center px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <p className="text-red-600">
              {error || "Restaurante não encontrado."}
            </p>

            <Link
              to="/restaurants"
              className="text-orange-600 mt-4 inline-block font-semibold"
            >
              Voltar aos restaurantes
            </Link>
          </div>
        </main>

        <Footer />
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
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-desc") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return Number(b.id) - Number(a.id);
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={18} />
          Voltar aos restaurantes
        </Link>

        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="h-72 md:h-96 relative">
            <img
              src={getRestaurantImage()}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center gap-2 bg-white/95 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                <CheckCircle size={16} />
                Restaurante disponível
              </span>
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <span className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <Store size={16} />
                FoodHub parceiro
              </span>

              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-white">
                {restaurant.name}
              </h1>

              <p className="mt-3 text-slate-200 max-w-3xl text-lg">
                {restaurant.description || "Restaurante disponível no FoodHub."}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 grid lg:grid-cols-4 gap-5">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin size={17} className="text-orange-600" />
                Endereço
              </p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {restaurant.address || "Não informado"}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Phone size={17} className="text-orange-600" />
                Contacto
              </p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {restaurant.phone || "Não informado"}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock size={17} className="text-orange-600" />
                Tempo estimado
              </p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {ESTIMATED_TIME}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Truck size={17} className="text-orange-600" />
                Taxa de entrega
              </p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {formatCurrency(DELIVERY_FEE)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="text-orange-600" size={30} />
                Pratos disponíveis
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Pesquise, filtre e escolha os pratos que deseja adicionar ao
                carrinho.
              </p>
            </div>

            <Link
              to="/cart"
              className="relative bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 text-center font-bold flex items-center justify-center gap-2"
            >
              <ShoppingCart size={19} />
              Ver carrinho

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="mt-6 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
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
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recent">Mais recentes</option>
                <option value="name">Nome A-Z</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {filteredDishes.length} prato(s) encontrado(s).
            </p>
          </div>

          {availableDishes.length === 0 ? (
            <div className="mt-6 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Utensils size={36} />
              </div>

              <p className="mt-5 text-slate-500 dark:text-slate-400">
                Este restaurante ainda não possui pratos disponíveis.
              </p>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="mt-6 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Search size={36} />
              </div>

              <p className="mt-5 text-slate-500 dark:text-slate-400">
                Nenhum prato encontrado com os filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition group border border-slate-100 dark:border-slate-800"
                >
                  <div className="h-48 bg-orange-100 relative overflow-hidden">
                    <img
                      src={getDishImage(dish)}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {dish.category && (
                      <span className="absolute top-4 left-4 bg-white/95 text-orange-600 text-xs px-3 py-1 rounded-full font-bold">
                        {dish.category.name}
                      </span>
                    )}

                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      <CheckCircle size={14} />
                      Disponível
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {dish.name}
                      </h3>

                      <div className="flex items-center gap-1 text-yellow-500 shrink-0">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-bold">4.8</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 min-h-[40px]">
                      {dish.description || "Sem descrição."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Preço
                        </p>
                        <p className="text-2xl font-extrabold text-orange-600">
                          {formatCurrency(dish.price)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Entrega
                        </p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {ESTIMATED_TIME}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(dish)}
                      className="mt-5 w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-bold flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
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