import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import CreateRestaurant from "./pages/CreateRestaurant";
import ManageDishes from "./pages/ManageDishes";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCategories from "./pages/ManageCategories";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import BackToTop from "./components/BackToTop";
import SessionManager from "./components/SessionManager";

function App() {
  return (
    <BrowserRouter>
      <SessionManager />
      <BackToTop />
      <Toaster position="top-right" />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CLIENTE", "RESTAURANTE", "ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Rotas do cliente */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["CLIENTE"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["CLIENTE"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Rotas do restaurante */}

        {/* Painel do restaurante */}
        <Route
          path="/restaurant-dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Cadastro do restaurante */}
        <Route
          path="/create-restaurant"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <CreateRestaurant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/register"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <CreateRestaurant />
            </ProtectedRoute>
          }
        />

        {/* Gestão de pratos */}
        <Route
          path="/manage-dishes"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <ManageDishes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/dishes"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANTE"]}>
              <ManageDishes />
            </ProtectedRoute>
          }
        />

        {/* Rotas do administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageCategories />
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;