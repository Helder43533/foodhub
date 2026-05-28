import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Star,
  Store,
  ShoppingCart,
  PackageCheck,
  Utensils,
  Smartphone,
  CheckCircle,
  UserPlus
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const slides = [
  {
    title: "Comida rápida, saborosa e perto de si",
    description:
      "Encontre restaurantes, escolha os seus pratos favoritos e faça pedidos online em poucos cliques.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Peça hoje, receba com praticidade",
    description:
      "Acompanhe o estado do pedido desde a confirmação até à entrega.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Restaurantes locais numa única plataforma",
    description:
      "O FoodHub aproxima clientes e restaurantes com uma experiência simples e moderna.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80"
  }
];

const categories = [
  {
    title: "Pizza",
    description: "Pratos rápidos e saborosos",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Hambúrguer",
    description: "Opções práticas para o dia",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Comida caseira",
    description: "Refeições completas e tradicionais",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Bebidas",
    description: "Acompanhamentos frescos",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80"
  }
];

function Home() {
  const { addToCart } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularDishes, setPopularDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadPopularDishes() {
      try {
        setLoadingDishes(true);

        const response = await api.get("/restaurants");

        const allDishes = response.data.flatMap((restaurant) =>
          (restaurant.dishes || [])
            .filter((dish) => dish.isAvailable)
            .map((dish) => ({
              ...dish,
              restaurant: {
                id: restaurant.id,
                name: restaurant.name
              },
              restaurantId: restaurant.id,
              restaurantName: restaurant.name
            }))
        );

        const selectedDishes = allDishes.slice(0, 3);

        setPopularDishes(selectedDishes);
      } catch (err) {
        setPopularDishes([]);
      } finally {
        setLoadingDishes(false);
      }
    }

    loadPopularDishes();
  }, []);

  const slide = slides[currentSlide];

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

  const handleAddToCart = (dish) => {
    const result = addToCart(dish);

    if (result?.success === false) {
      toast.error(result.message || "Não foi possível adicionar ao carrinho.");
      return;
    }

    toast.success(result?.message || "Prato adicionado ao carrinho.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative min-h-[650px] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.92), rgba(15,23,42,0.55), rgba(15,23,42,0.25)), url(${slide.image})`
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/50" />

          <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-100 px-4 py-2 rounded-full text-sm font-bold border border-orange-400/20">
                <Star size={16} />
                Plataforma moderna para pedidos de comida
              </span>

              <h1 className="mt-6 text-5xl md:text-7xl font-extrabold text-white leading-tight">
                {slide.title}
              </h1>

              <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl leading-8">
                {slide.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/restaurants"
                  className="bg-orange-600 text-white px-7 py-4 rounded-2xl hover:bg-orange-700 flex items-center gap-2 font-bold shadow-lg shadow-orange-950/20"
                >
                  Ver restaurantes
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/register"
                  className="bg-white/15 text-white px-7 py-4 rounded-2xl hover:bg-white/25 border border-white/20 font-bold backdrop-blur"
                >
                  Criar conta
                </Link>
              </div>

              <div className="mt-10 flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 rounded-full transition-all ${
                      currentSlide === index
                        ? "w-10 bg-orange-500"
                        : "w-3 bg-white/50 hover:bg-white"
                    }`}
                    title={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Pratos mais pedidos
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Escolha rapidamente um dos pratos em destaque
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {loadingDishes ? (
                    <>
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl animate-pulse"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : popularDishes.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-center">
                      <p className="text-slate-500 dark:text-slate-400">
                        Ainda não há pratos em destaque.
                      </p>
                    </div>
                  ) : (
                    popularDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl"
                      >
                        <img
                          src={getDishImage(dish)}
                          alt={dish.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">
                            {dish.name}
                          </h3>

                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {dish.restaurantName}
                          </p>

                          <strong className="text-orange-600">
                            {Number(dish.price).toLocaleString("pt-MZ")} MT
                          </strong>
                        </div>

                        <button
                          onClick={() => handleAddToCart(dish)}
                          className="bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-700"
                          title="Adicionar ao carrinho"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  to="/restaurants"
                  className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100"
                >
                  Ver todos os restaurantes
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Clock />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Pedido rápido
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Escolha o restaurante, adicione pratos ao carrinho e finalize o
                pedido em poucos passos.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
                <Truck />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Entrega organizada
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Acompanhe o estado do pedido: pendente, confirmado, em
                preparação, a caminho e entregue.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <ShieldCheck />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Sistema seguro
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Login, permissões por tipo de utilizador, sessão automática e
                gestão de pedidos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 py-16 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                <ShoppingCart size={17} />
                Simples e rápido
              </span>

              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 dark:text-white">
                Como funciona?
              </h2>

              <p className="mt-4 text-slate-600 dark:text-slate-300">
                O FoodHub organiza o processo de encomenda em passos simples.
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-4 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  1
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Escolha o restaurante
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Veja restaurantes parceiros e escolha onde deseja comprar.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  2
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Selecione os pratos
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Pesquise, filtre, veja preços e adicione pratos ao carrinho.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  3
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Confirme o pedido
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Informe endereço, pagamento e confirme a encomenda.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  4
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Acompanhe o estado
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Consulte os seus pedidos abertos e finalizados.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
              <Utensils size={17} />
              Categorias
            </span>

            <h2 className="mt-5 text-4xl font-extrabold text-slate-900 dark:text-white">
              Categorias populares
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Encontre rapidamente o tipo de refeição que deseja pedir.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.title}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-100 dark:border-slate-800"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-200">
                    {category.description}
                  </p>

                  <Link
                    to="/restaurants"
                    className="mt-5 inline-block bg-white text-orange-600 px-5 py-2 rounded-xl font-semibold hover:bg-orange-50"
                  >
                    Ver opções
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Store size={28} />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                Para restaurantes
              </h2>

              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
                Restaurantes podem criar conta, cadastrar dados, aguardar
                aprovação do administrador, publicar pratos e gerir pedidos
                recebidos.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Cadastrar pratos e categorias",
                  "Activar ou pausar pratos",
                  "Gerir pedidos recebidos",
                  "Acompanhar vendas no painel"
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle size={18} className="text-orange-600" />
                    {item}
                  </p>
                ))}
              </div>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-2xl hover:bg-orange-700 font-bold"
              >
                <UserPlus size={18} />
                Cadastrar restaurante
              </Link>
            </div>

            <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-sm text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-orange-400 flex items-center justify-center">
                <Smartphone size={28} />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold">
                Instale como aplicação
              </h2>

              <p className="mt-4 text-slate-300 leading-7">
                O FoodHub foi preparado como PWA, permitindo uma experiência
                parecida com uma aplicação no computador ou telemóvel.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Interface responsiva",
                  "Experiência leve",
                  "Ideal para telemóvel",
                  "Design moderno"
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle size={18} className="text-orange-400" />
                    {item}
                  </p>
                ))}
              </div>

              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl hover:bg-slate-100 font-bold"
              >
                Saber mais
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-10 md:p-14 text-center">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Pronto para fazer o seu pedido?
              </h2>

              <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                Explore restaurantes disponíveis, escolha os seus pratos
                favoritos e finalize a sua encomenda de forma simples.
              </p>

              <Link
                to="/restaurants"
                className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl hover:bg-orange-700 font-bold"
              >
                Começar agora
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;