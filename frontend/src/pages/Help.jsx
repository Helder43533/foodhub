import { Link } from "react-router-dom";
import {
  HelpCircle,
  ShoppingCart,
  UserPlus,
  Store,
  PackageCheck,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Help() {
  const faqs = [
    {
      question: "Como faço um pedido?",
      answer:
        "Entre na página Restaurantes, escolha um restaurante, seleccione os pratos, adicione ao carrinho e finalize o pedido no checkout."
    },
    {
      question: "Posso adicionar pratos de restaurantes diferentes no mesmo carrinho?",
      answer:
        "Não. Para evitar confusão na entrega, o carrinho aceita pratos de apenas um restaurante por pedido."
    },
    {
      question: "Como acompanho o meu pedido?",
      answer:
        "Depois de finalizar o pedido, aceda à página Meus pedidos para acompanhar o estado da encomenda."
    },
    {
      question: "Como um restaurante começa a vender?",
      answer:
        "O restaurante deve criar uma conta do tipo Restaurante, cadastrar os dados do restaurante e aguardar aprovação do administrador."
    },
    {
      question: "O FoodHub pode ser instalado no telemóvel?",
      answer:
        "Sim. Na página inicial existe o botão Instalar aplicação. Também pode usar a opção Adicionar ao ecrã inicial no navegador."
    }
  ];

  const steps = [
    {
      icon: <UserPlus size={26} />,
      title: "Criar conta",
      text: "Cadastre-se como cliente ou restaurante."
    },
    {
      icon: <Store size={26} />,
      title: "Escolher restaurante",
      text: "Veja restaurantes aprovados e disponíveis."
    },
    {
      icon: <ShoppingCart size={26} />,
      title: "Adicionar ao carrinho",
      text: "Escolha pratos e confirme as quantidades."
    },
    {
      icon: <PackageCheck size={26} />,
      title: "Acompanhar pedido",
      text: "Veja o estado do pedido até à entrega."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28">
        <section className="max-w-7xl mx-auto px-6 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-12 border border-slate-100 dark:border-slate-800">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                <HelpCircle size={18} />
                Centro de ajuda
              </span>

              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold">
                Como podemos ajudar?
              </h1>

              <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-8">
                Encontre aqui orientações rápidas sobre como usar o FoodHub,
                fazer pedidos, gerir restaurantes e instalar a aplicação.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/restaurants"
                  className="bg-orange-600 text-white px-6 py-3 rounded-2xl hover:bg-orange-700 font-bold inline-flex items-center gap-2"
                >
                  Ver restaurantes
                  <ChevronRight size={18} />
                </Link>

                <Link
                  to="/register"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                >
                  Criar conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                  {step.icon}
                </div>

                <h3 className="mt-5 text-xl font-extrabold">{step.title}</h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-7 md:p-8">
              <h2 className="text-3xl font-extrabold flex items-center gap-2">
                <HelpCircle className="text-orange-600" />
                Perguntas frequentes
              </h2>

              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700"
                  >
                    <h3 className="font-extrabold text-lg">{faq.question}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300 leading-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-3xl border border-orange-100 dark:border-orange-900 p-6">
                <h3 className="text-xl font-extrabold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <Smartphone size={24} />
                  Instalação
                </h3>

                <p className="mt-3 text-orange-700 dark:text-orange-300 text-sm leading-6">
                  O FoodHub pode ser instalado como aplicação no telemóvel ou
                  computador através da funcionalidade PWA.
                </p>

                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-700"
                >
                  Ir para instalação
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <ShieldCheck className="text-orange-600" size={24} />
                  Segurança
                </h3>

                <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-6">
                  O sistema usa login, permissões por tipo de utilizador e rotas
                  protegidas para controlar o acesso às funcionalidades.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Help;