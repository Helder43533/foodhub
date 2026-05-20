import { useEffect, useState } from "react";
import { Edit, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!user || user.role !== "RESTAURANTE") {
      setError("Apenas restaurantes podem cadastrar pratos.");
      return;
    }

    if (!myRestaurant) {
      setError("Antes de cadastrar pratos, crie o seu restaurante.");
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
        setMessage("Prato actualizado com sucesso.");
      } else {
        await api.post("/dishes", payload, { headers });
        setMessage("Prato cadastrado com sucesso.");
      }

      resetForm();
      await loadMyRestaurant();
    } catch (err) {
      setError(
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

      setMessage(
        dish.isAvailable
          ? "Prato marcado como indisponível."
          : "Prato marcado como disponível."
      );

      await loadMyRestaurant();
    } catch (err) {
      setError(
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

      setMessage("Prato removido com sucesso.");

      if (editingDishId === dishId) {
        resetForm();
      }

      await loadMyRestaurant();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao remover prato.");
    }
  };

  if (!user || user.role !== "RESTAURANTE") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-32 max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Acesso restrito
            </h1>

            <p className="mt-3 text-slate-500">
              Esta página é permitida apenas para utilizadores do tipo restaurante.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            Gestão de pratos
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900">
            Meus pratos
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Cadastre, edite, active ou remova pratos do seu restaurante.
          </p>
        </section>

        {pageLoading && (
          <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm">
            <p className="text-slate-500">Carregando informações...</p>
          </div>
        )}

        {!pageLoading && !myRestaurant && (
          <div className="mt-8 bg-yellow-50 text-yellow-700 p-4 rounded-xl">
            Antes de cadastrar pratos, é necessário criar o restaurante.
          </div>
        )}

        {message && (
          <div className="mt-8 bg-green-50 text-green-700 p-4 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        <section className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-7 rounded-3xl shadow-sm h-fit">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingDishId ? "Editar prato" : "Novo prato"}
              </h2>

              {editingDishId && (
                <button
                  onClick={resetForm}
                  className="text-slate-500 hover:text-red-600 flex items-center gap-1 text-sm"
                >
                  <X size={16} />
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Nome do prato
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Pizza de Frango"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Descrição
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Descrição do prato"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Preço
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: 450"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Imagem URL
                </label>

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Link da imagem"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Se deixar vazio, o sistema escolherá uma imagem automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Categoria
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-2 w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
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
            <h2 className="text-2xl font-bold text-slate-900">
              Pratos cadastrados
            </h2>

            {dishes.length === 0 ? (
              <div className="mt-6 bg-white p-8 rounded-3xl shadow-sm text-center">
                <p className="text-slate-500">
                  Nenhum prato cadastrado ainda.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-3xl shadow-sm overflow-hidden"
                  >
                    <div className="h-44 bg-orange-100 relative">
                      <img
                        src={getDishImage(dish)}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />

                      <span
                        className={
                          "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold " +
                          (dish.isAvailable
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700")
                        }
                      >
                        {dish.isAvailable ? "Disponível" : "Indisponível"}
                      </span>
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

                      <p className="mt-2 text-sm text-slate-600">
                        {dish.description || "Sem descrição."}
                      </p>

                      <p className="mt-4 text-2xl font-extrabold text-orange-600">
                        {dish.price} MZN
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="bg-blue-50 text-blue-700 py-3 rounded-xl hover:bg-blue-100 font-semibold flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => toggleAvailability(dish)}
                          className={
                            "py-3 rounded-xl font-semibold flex items-center justify-center gap-2 " +
                            (dish.isAvailable
                              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100")
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
                          className="bg-red-50 text-red-700 py-3 rounded-xl hover:bg-red-100 font-semibold flex items-center justify-center gap-2"
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