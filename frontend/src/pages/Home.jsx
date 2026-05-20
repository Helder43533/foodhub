import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Truck, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const slides = [
  {
    title: "Comida rápida, saborosa e perto de si",
    description:
      "Encontre restaurantes, escolha os seus pratos favoritos e faça pedidos online em poucos cliques.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Peça hoje, receba com praticidade",
    description:
      "Acompanhe o estado do pedido desde a confirmação até à entrega.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Restaurantes locais numa única plataforma",
    description:
      "O FoodHub aproxima clientes e restaurantes com uma experiência simples e moderna.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"
  }
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
     
      <main className="pt-20">
        <section className="relative min-h-[620px] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.88), rgba(15,23,42,0.45)), url(${slide.image})`
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-100 px-4 py-2 rounded-full text-sm font-medium">
                <Star size={16} />
                Plataforma moderna para pedidos de comida
              </span>

              <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-white leading-tight">
                {slide.title}
              </h1>

              <p className="mt-6 text-lg text-slate-200 max-w-xl">
                {slide.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/restaurants"
                  className="bg-orange-600 text-white px-7 py-4 rounded-2xl hover:bg-orange-700 flex items-center gap-2 font-semibold"
                >
                  Ver restaurantes
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/register"
                  className="bg-white/15 text-white px-7 py-4 rounded-2xl hover:bg-white/25 border border-white/20 font-semibold"
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
                        : "w-3 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900">
                  Pedido em destaque
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4 items-center bg-orange-50 p-4 rounded-2xl">
                    <span className="text-4xl">🍕</span>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Pizza de Frango
                      </h3>
                      <p className="text-sm text-slate-500">
                        Queijo, frango e molho especial
                      </p>
                    </div>
                    <strong className="ml-auto text-orange-600">450 MZN</strong>
                  </div>

                  <div className="flex gap-4 items-center bg-green-50 p-4 rounded-2xl">
                    <span className="text-4xl">🥗</span>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Salada Especial
                      </h3>
                      <p className="text-sm text-slate-500">
                        Leve, saudável e saborosa
                      </p>
                    </div>
                    <strong className="ml-auto text-orange-600">300 MZN</strong>
                  </div>

                  <div className="flex gap-4 items-center bg-yellow-50 p-4 rounded-2xl">
                    <span className="text-4xl">🥤</span>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Bebida Natural
                      </h3>
                      <p className="text-sm text-slate-500">
                        Ideal para acompanhar
                      </p>
                    </div>
                    <strong className="ml-auto text-orange-600">120 MZN</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Clock />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Pedido rápido
              </h3>
              <p className="mt-2 text-slate-600">
                Escolha o restaurante, adicione pratos ao carrinho e finalize o pedido.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                <Truck />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Entrega organizada
              </h3>
              <p className="mt-2 text-slate-600">
                Acompanhe o estado do pedido: pendente, confirmado, em preparação e entregue.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Sistema seguro
              </h3>
              <p className="mt-2 text-slate-600">
                Login, permissões por tipo de utilizador e gestão de pedidos.
              </p>
            </div>
          </div>
        </section>

<section className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-4xl font-extrabold text-slate-900">
        Categorias populares
      </h2>

      <p className="mt-4 text-slate-600">
        Encontre rapidamente o tipo de refeição que deseja pedir.
      </p>
    </div>

    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
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
      ].map((category) => (
        <div
          key={category.title}
          className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
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
  </div>
</section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-slate-900 rounded-[2rem] p-10 md:p-14 text-center">
            <h2 className="text-4xl font-extrabold text-white">
              Pronto para fazer o seu pedido?
            </h2>

            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              Explore restaurantes disponíveis, escolha os seus pratos favoritos
              e finalize a sua encomenda de forma simples.
            </p>

            <Link
              to="/restaurants"
              className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl hover:bg-orange-700 font-semibold"
            >
              Começar agora
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      
      </main>
      <Footer/>
      </div>
      
  );
}

export default Home;