export const DELIVERY_FEE = 100;
export const ESTIMATED_DELIVERY_TIME = "30 a 45 minutos";

export function calculateCartSummary(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;

  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
    estimatedTime: ESTIMATED_DELIVERY_TIME
  };
}

export function formatCurrency(value) {
  return `${Number(value).toLocaleString("pt-MZ")} MT`;
}