import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Search,
  Filter,
  Utensils,
  PlusCircle,
  CheckCircle,
  PauseCircle,
  Image,
  Tag,
  DollarSign,
  RefreshCcw
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("pt-MZ")} MT`;
}

function ManageDishes() {
  const { token, user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);

  const [editingDishId, setEditingDishId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: "Bearer " + token
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

  const loadCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const loadMyRestaurant = async () => {
    try {
      const response = await api.get("/restaurants");

      const restaurant = response.data.find(
        (item) => item.owner?.id === user?.id
      );

      if (restaurant) {
        setMyRestaurant(restaurant);

        const dishesResponse = await api.get(
          "/dishes/restaurant/" + restaurant.id
        );

        setDishes(dishesResponse.data);
      } else {
        setMyRestaurant(null);
        setDishes([]);
      }
    } catch (err) {
      setError("Erro ao carregar dados do restaurante.");
    }
  };

  const loadData = async () => {
    try {
      setPageLoading(true);
      setError("");
      await loadCategories();
      await loadMyRestaurant();
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      loadData();
    }
  }, [user, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setEditingDishId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: ""
    });
  };

  const handleEdit = (dish) => {
    setEditingDishId(dish.id);

    setFormData({
      name: dish.name || "",
      description: dish.description || "",
      price: dish.price || "",
      imageUrl: dish.imageUrl || "",
      categoryId: dish.categoryId || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const showSuccess = (text) => {
    setMessage(text);
    toast.success(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const showError = (text) => {
    setError(text);
    toast.error(text);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!user || user.role !== "RESTAURANTE") {
      showError("Apenas restaurantes podem cadastrar pratos.");
      return;
    }

    if (!myRestaurant) {
      showError("Antes de cadastrar pratos, crie o seu restaurante.");
      return;
    }

    if (Number(formData.price) <= 0) {
      showError("O preço do prato deve ser maior que zero.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null
      };

      if (editingDishId) {
        await api.patch("/dishes/" + editingDishId, payload, { headers });
        showSuccess("Prato actualizado com sucesso.");
      } else {
        await api.post("/dishes", payload, { headers });
        showSuccess("Prato cadastrado com sucesso.");
      }

      resetForm();
      await loadMyRestaurant();
    } catch (err) {
      showError(
        err.response?.data?.message ||
          "Erro ao salvar prato. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      setMessage("");
      setError("");

      await api.patch(
        "/dishes/" + dish.id,
        {
          isAvailable: !dish.isAvailable
        },
        { headers }
      );

      showSuccess(
        dish.isAvailable
          ? "Prato marcado como indisponível."
          : "Prato marcado como disponível."
      );

      await loadMyRestaurant();
    } catch (err) {
      showError(
        err.response?.data?.message || "Erro ao alterar disponibilidade do prato."
      );
    }
  };

  const deleteDish = async (dishId) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover este prato?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await api.delete("/dishes/" + dishId, { headers });

      showSuccess("Prato removido com sucesso.");

      if (editingDishId === dishId) {
        resetForm();
      }

      await loadMyRestaurant();
    } catch (err) {
      showError(err.response?.data?.message || "Erro ao remover prato.");
    }
  };

  const availableDishes = dishes.filter((dish) => dish.isAvailable);
  const pausedDishes = dishes.filter((dish) => !dish.isAvailable);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        dish.name?.toLowerCase().includes(term) ||
        dish.description?.toLowerCase().includes(term) ||
        dish.category?.name?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && dish.isAvailable) ||
        (statusFilter === "paused" && !dish.isAvailable);

      const matchesCategory =
        categoryFilter === "all" ||
        String(dish.categoryId || "") === String(categoryFilter);

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [dishes, searchTerm, statusFilter, categoryFilter]);

  if (!user || user.role !== "RESTAURANTE") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Esta página é permitida apenas para utilizadores do tipo
              restaurante.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-orange-100 dark:bg-orange-950/40 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-4 py-2 rounded-full">
                <Utensils size={18} />
                Gestão de pratos
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                Meus pratos
              </h1>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                Cadastre, edite, active, pause ou remova pratos do seu
                restaurante.
              </p>
            </div>

            <button
              onClick={loadData}
              className="bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Actualizar
            </button>
          </div>
        </section>

        {pageLoading && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Carregando informações...
            </p>
          </div>
        )}

        {!pageLoading && !myRestaurant && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900">
            Antes de cadastrar pratos, é necessário criar o restaurante.
          </div>
        )}

        {message && (
          <div className="mt-8 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-4 rounded-xl border border-green-100 dark:border-green-900">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        {!pageLoading && myRestaurant && (
          <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Utensils size={24} />
              </div>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Total de pratos
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                {dishes.length}
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Disponíveis
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-green-600">
                {availableDishes.length}
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 flex items-center justify-center">
                <PauseCircle size={24} />
              </div>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Pausados
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-yellow-600">
                {pausedDishes.length}
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Tag size={24} />
              </div>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Categorias
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-blue-600">
                {categories.length}
              </h2>
            </div>
          </section>
        )}

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm h-fit border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="text-orange-600" size={24} />
                {editingDishId ? "Editar prato" : "Novo prato"}
              </h2>

              {editingDishId && (
                <button
                  onClick={resetForm}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 flex items-center gap-1 text-sm"
                >
                  <X size={16} />
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nome do prato
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Pizza de Frango"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Descrição
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Descrição do prato"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Preço
                </label>

                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: 450"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Imagem URL
                </label>

                <div className="relative">
                  <Image
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Link da imagem"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Se deixar vazio, o sistema escolherá uma imagem
                  automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Categoria
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Sem categoria</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !myRestaurant}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 disabled:opacity-60 font-semibold"
              >
                {loading
                  ? "Salvando..."
                  : editingDishId
                  ? "Actualizar prato"
                  : "Cadastrar prato"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Pratos cadastrados
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {filteredDishes.length} prato(s) encontrado(s).
                  </p>
                </div>
              </div>

              <div className="mt-5 grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Pesquisar prato..."
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">Todos estados</option>
                    <option value="available">Disponíveis</option>
                    <option value="paused">Pausados</option>
                  </select>
                </div>

                <div className="relative">
                  <Tag
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">Todas categorias</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {dishes.length === 0 ? (
              <div className="mt-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                  <Utensils size={36} />
                </div>

                <p className="mt-5 text-slate-500 dark:text-slate-400">
                  Nenhum prato cadastrado ainda.
                </p>
              </div>
            ) : filteredDishes.length === 0 ? (
              <div className="mt-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                  <Search size={36} />
                </div>

                <p className="mt-5 text-slate-500 dark:text-slate-400">
                  Nenhum prato encontrado com os filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition"
                  >
                    <div className="h-48 bg-orange-100 relative overflow-hidden">
                      <img
                        src={getDishImage(dish)}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                      <span
                        className={
                          "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold " +
                          (dish.isAvailable
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700")
                        }
                      >
                        {dish.isAvailable ? "Disponível" : "Pausado"}
                      </span>

                      {dish.category && (
                        <span className="absolute bottom-4 left-4 bg-white/95 text-orange-600 text-xs px-3 py-1 rounded-full font-bold">
                          {dish.category.name}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {dish.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[40px]">
                        {dish.description || "Sem descrição."}
                      </p>

                      <p className="mt-4 text-2xl font-extrabold text-orange-600">
                        {formatCurrency(dish.price)}
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/60 font-semibold flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => toggleAvailability(dish)}
                          className={
                            "py-3 rounded-xl font-semibold flex items-center justify-center gap-2 " +
                            (dish.isAvailable
                              ? "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/60"
                              : "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/60")
                          }
                        >
                          {dish.isAvailable ? (
                            <>
                              <ToggleLeft size={16} />
                              Pausar
                            </>
                          ) : (
                            <>
                              <ToggleRight size={16} />
                              Activar
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteDish(dish.id)}
                          className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/60 font-semibold flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ManageDishes;