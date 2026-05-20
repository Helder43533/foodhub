import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("foodhub_cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("foodhub_cart", JSON.stringify(items));
  };

  const addToCart = (dish) => {
    const currentRestaurantId = cartItems[0]?.restaurantId;

    if (
      cartItems.length > 0 &&
      currentRestaurantId &&
      currentRestaurantId !== dish.restaurantId
    ) {
      const confirmChange = window.confirm(
        "O carrinho já possui pratos de outro restaurante. Deseja limpar o carrinho e adicionar este prato?"
      );

      if (!confirmChange) {
        return {
          success: false,
          message: "Prato não adicionado. O carrinho mantém o restaurante anterior."
        };
      }

      const newItem = {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurant?.name || ""
      };

      saveCart([newItem]);

      return {
        success: true,
        message: "Carrinho anterior limpo. Novo prato adicionado."
      };
    }

    const existingItem = cartItems.find((item) => item.id === dish.id);

    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      saveCart(updatedItems);

      return {
        success: true,
        message: dish.name + " adicionado novamente ao carrinho."
      };
    }

    const newItem = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurant?.name || dish.restaurantName || "Restaurante"

    };

    saveCart([...cartItems, newItem]);

    return {
      success: true,
      message: dish.name + " adicionado ao carrinho."
    };
  };

  const removeFromCart = (dishId) => {
    const updatedItems = cartItems.filter((item) => item.id !== dishId);
    saveCart(updatedItems);
  };

  const increaseQuantity = (dishId) => {
    const updatedItems = cartItems.map((item) =>
      item.id === dishId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    saveCart(updatedItems);
  };

  const decreaseQuantity = (dishId) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === dishId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const restaurantName = cartItems[0]?.restaurantName || "";

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total,
        restaurantName
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}