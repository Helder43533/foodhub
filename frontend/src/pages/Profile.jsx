import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
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

    setSuccess("Perfil actualizado com sucesso.");

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const getRoleName = (role) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "RESTAURANTE") return "Restaurante";
    return "Cliente";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <section className="max-w-5xl mx-auto px-4 md:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <User size={46} />
                </div>

                <h1 className="mt-5 text-2xl font-extrabold">
                  {formData.name || "Utilizador"}
                </h1>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {formData.email}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                  <ShieldCheck size={17} />
                  {getRoleName(formData.role)}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold">
                    Dados do perfil
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Visualize e actualize os seus dados pessoais.
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
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: 84 000 0000"
                      />
                    </div>
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
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        placeholder="Digite o endereço que será usado nos pedidos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Tipo de conta
                    </label>

                    <input
                      type="text"
                      value={getRoleName(formData.role)}
                      disabled
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Guardar alterações
                  </button>
                </form>
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