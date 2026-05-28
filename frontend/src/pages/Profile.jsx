import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  ArrowLeft,
  CheckCircle,
  Home,
  Truck,
  Trash2,
  Lock,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    address: ""
  });

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("foodhub_profile") || "{}"
    );

    setFormData({
      name: user?.name || savedProfile.name || "",
      email: user?.email || savedProfile.email || "",
      role: user?.role || savedProfile.role || "",
      phone: savedProfile.phone || "",
      address: savedProfile.address || ""
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const showSuccess = (message) => {
    setSuccess(message);
    toast.success(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("foodhub_profile", JSON.stringify(formData));

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      role: formData.role || currentUser.role
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    showSuccess("Perfil actualizado com sucesso.");
  };

  const clearAddress = () => {
    const updatedData = {
      ...formData,
      address: ""
    };

    setFormData(updatedData);
    localStorage.setItem("foodhub_profile", JSON.stringify(updatedData));

    showSuccess("Endereço padrão removido.");
  };

  const getRoleName = (role) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "RESTAURANTE") return "Restaurante";
    return "Cliente";
  };

  const getRoleDescription = (role) => {
    if (role === "ADMIN") {
      return "Pode gerir utilizadores, restaurantes, categorias e acompanhar pedidos.";
    }

    if (role === "RESTAURANTE") {
      return "Pode cadastrar restaurante, gerir pratos e acompanhar pedidos recebidos.";
    }

    return "Pode pesquisar restaurantes, fazer pedidos e acompanhar encomendas.";
  };

  const getBackLink = () => {
    if (formData.role === "ADMIN") return "/admin";
    if (formData.role === "RESTAURANTE") return "/restaurant-dashboard";
    return "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <Link
            to={getBackLink()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 md:p-10 mb-8">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                  <User size={18} />
                  Meu perfil
                </span>

                <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                  Dados da conta
                </h1>

                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                  Visualize e actualize os seus dados pessoais, contacto e
                  endereço padrão usado no checkout.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 min-w-64">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tipo de conta
                </p>

                <div className="mt-2 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                  <ShieldCheck size={17} />
                  {getRoleName(formData.role)}
                </div>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                  <User size={46} />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formData.name || "Utilizador"}
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400 break-all">
                  {formData.email}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                  <ShieldCheck size={17} />
                  {getRoleName(formData.role)}
                </div>

                <p className="mt-5 text-sm text-slate-500 dark:text-slate-400 leading-6">
                  {getRoleDescription(formData.role)}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6">
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Info className="text-orange-600" size={22} />
                  Resumo
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="text-orange-600 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Telefone
                      </p>
                      <p className="font-bold">
                        {formData.phone || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-600 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Endereço padrão
                      </p>
                      <p className="font-bold">
                        {formData.address || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-3xl border border-orange-100 dark:border-orange-900 p-6">
                <h3 className="text-lg font-extrabold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <Truck size={21} />
                  Endereço no checkout
                </h3>

                <p className="mt-3 text-sm text-orange-700 dark:text-orange-300 leading-6">
                  O endereço padrão guardado aqui será preenchido
                  automaticamente quando fores finalizar um pedido.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold flex items-center gap-2">
                    <User className="text-orange-600" size={25} />
                    Dados pessoais
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Actualize os dados básicos da sua conta.
                  </p>
                </div>

                {success && (
                  <div className="mb-5 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 text-green-700 dark:text-green-300 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} />
                    <span className="font-semibold">{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Nome completo
                    </label>

                    <div className="relative">
                      <User
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Digite o seu nome"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Digite o seu email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Telefone
                    </label>

                    <div className="relative">
                      <Phone
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: 84 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Tipo de conta
                    </label>

                    <div className="relative">
                      <ShieldCheck
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={getRoleName(formData.role)}
                        disabled
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Guardar alterações
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold flex items-center gap-2">
                    <Home className="text-orange-600" size={25} />
                    Dados de entrega
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Este endereço será usado automaticamente no checkout.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Endereço padrão
                  </label>

                  <div className="relative">
                    <MapPin
                      size={19}
                      className="absolute left-4 top-4 text-slate-400"
                    />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="Digite o endereço que será usado nos pedidos"
                    />
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleSubmit}
                    className="bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Guardar endereço
                  </button>

                  <button
                    type="button"
                    onClick={clearAddress}
                    disabled={!formData.address}
                    className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 py-3 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-950/60 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={19} />
                    Limpar endereço
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <Lock size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold">
                      Segurança da conta
                    </h2>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      A alteração de senha pode ser adicionada numa próxima
                      melhoria, ligada directamente ao backend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;