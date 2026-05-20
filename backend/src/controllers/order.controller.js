const prisma = require("../utils/prisma");

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "O pedido deve ter pelo menos um prato."
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "A forma de pagamento é obrigatória."
      });
    }

    let total = 0;
    let restaurantId = null;
    const orderItemsData = [];

    for (const item of items) {
      const dish = await prisma.dish.findUnique({
        where: {
          id: Number(item.dishId)
        },
        include: {
          restaurant: true
        }
      });

      if (!dish) {
        return res.status(404).json({
          message: `Prato com ID ${item.dishId} não encontrado.`
        });
      }

      if (!dish.isAvailable) {
        return res.status(400).json({
          message: `O prato ${dish.name} não está disponível.`
        });
      }

      if (!dish.restaurant.isActive) {
        return res.status(400).json({
          message: `O restaurante do prato ${dish.name} não está activo.`
        });
      }

      if (restaurantId === null) {
        restaurantId = dish.restaurantId;
      }

      if (restaurantId !== dish.restaurantId) {
        return res.status(400).json({
          message:
            "O pedido não pode conter pratos de restaurantes diferentes."
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          message: "A quantidade deve ser maior que zero."
        });
      }

      total += dish.price * quantity;

      orderItemsData.push({
        dishId: dish.id,
        quantity,
        price: dish.price
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        deliveryAddress,
        items: {
          create: orderItemsData
        },
        payment: {
          create: {
            method: paymentMethod,
            status: "PENDENTE"
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            dish: {
              include: {
                restaurant: true
              }
            }
          }
        },
        payment: true
      }
    });

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      order
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar pedido."
    });
  }
};
const listMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            dish: {
              include: {
                restaurant: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pedidos do cliente."
    });
  }
};

const listRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        ownerId: req.user.id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurante não encontrado para este utilizador."
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            dish: {
              restaurantId: restaurant.id
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          where: {
            dish: {
              restaurantId: restaurant.id
            }
          },
          include: {
            dish: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pedidos do restaurante."
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "PENDENTE",
      "CONFIRMADO",
      "EM_PREPARACAO",
      "A_CAMINHO",
      "ENTREGUE",
      "CANCELADO"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Estado do pedido inválido."
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        ownerId: req.user.id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurante não encontrado para este utilizador."
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        items: {
          include: {
            dish: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado."
      });
    }

    const belongsToRestaurant = order.items.some(
      (item) => item.dish.restaurantId === restaurant.id
    );

    if (!belongsToRestaurant) {
      return res.status(403).json({
        message: "Não pode actualizar pedidos de outro restaurante."
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            dish: true
          }
        },
        payment: true
      }
    });

    return res.json({
      message: "Estado do pedido actualizado com sucesso.",
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao actualizar estado do pedido."
    });
  }
};

module.exports = {
  createOrder,
  listMyOrders,
  listRestaurantOrders,
  updateOrderStatus
};