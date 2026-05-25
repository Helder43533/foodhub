import { Link } from "react-router-dom";
import {
  Utensils,
  Store,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Smartphone,
  Users,
  CheckCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 md:p-12">
            <span className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
              <Utensils size={18} />
              Sobre o FoodHub
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold max-w-4xl">
              Uma plataforma simples para pedidos de comida online
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-8">
              O FoodHub é um sistema web desenvolvido para aproximar clientes e
              restaurantes. Através da plataforma, os clientes podem visualizar
              restaurantes, consultar pratos disponíveis, adicionar produtos ao
              carrinho, finalizar pedidos e acompanhar o estado da encomenda.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/restaurants"
                className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700"
              >
                Ver restaurantes
              </Link>

              <Link
                to="/register"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Store size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold">Restaurantes</h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Restaurantes podem cadastrar pratos, gerir disponibilidade e
                acompanhar pedidos recebidos.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold">Pedidos</h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Clientes podem escolher pratos, adicionar ao carrinho e finalizar
                pedidos de forma simples.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold">Administração</h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                O administrador aprova restaurantes, cria categorias e acompanha
                dados gerais do sistema.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Smartphone size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold">PWA</h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                O sistema pode ser instalado como aplicação no computador ou no
                telemóvel.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 md:p-10">
            <h2 className="text-3xl font-extrabold">Como funciona?</h2>

            <div className="mt-8 grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  1
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  Escolha o restaurante
                </h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  O cliente consulta os restaurantes aprovados e disponíveis na
                  plataforma.
                </p>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  2
                </div>

                <h3 className="mt-4 text-xl font-bold">Selecione os pratos</h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  O cliente visualiza o menu, filtra pratos e adiciona itens ao
                  carrinho.
                </p>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  3
                </div>

                <h3 className="mt-4 text-xl font-bold">Finalize o pedido</h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  O cliente informa o endereço, escolhe o pagamento e confirma a
                  encomenda.
                </p>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl">
                  4
                </div>

                <h3 className="mt-4 text-xl font-bold">Acompanhe a entrega</h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  O restaurante actualiza o estado e o cliente acompanha o pedido
                  em tempo real.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8">
              <div className="flex items-center gap-3">
                <Users className="text-orange-600" size={28} />
                <h2 className="text-2xl font-extrabold">
                  Vantagens para clientes
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Consultar restaurantes e pratos disponíveis.",
                  "Pesquisar e filtrar pratos por categoria ou preço.",
                  "Fazer pedidos de forma rápida e organizada.",
                  "Acompanhar pedidos abertos e finalizados.",
                  "Utilizar o sistema em computador ou telemóvel."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="text-orange-600 mt-1" size={18} />
                    <p className="text-slate-600 dark:text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8">
              <div className="flex items-center gap-3">
                <Store className="text-orange-600" size={28} />
                <h2 className="text-2xl font-extrabold">
                  Vantagens para restaurantes
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Divulgar pratos e informações do restaurante.",
                  "Gerir disponibilidade dos pratos.",
                  "Receber pedidos de clientes online.",
                  "Actualizar o estado dos pedidos.",
                  "Acompanhar estatísticas de vendas e encomendas."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="text-orange-600 mt-1" size={18} />
                    <p className="text-slate-600 dark:text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
          <div className="bg-orange-600 rounded-3xl p-8 md:p-10 text-white text-center">
            <Truck size={42} className="mx-auto" />

            <h2 className="mt-4 text-3xl font-extrabold">
              Uma solução simples para o dia a dia
            </h2>

            <p className="mt-3 text-orange-100 max-w-3xl mx-auto">
              O FoodHub foi desenvolvido como projecto académico de programação
              web, demonstrando integração entre frontend, backend, base de dados,
              autenticação, gestão de permissões, PWA e interface responsiva.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 inline-block bg-white text-orange-600 px-7 py-3 rounded-2xl font-bold hover:bg-orange-50"
            >
              Começar agora
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;