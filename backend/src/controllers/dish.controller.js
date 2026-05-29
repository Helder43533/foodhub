const prisma = require("../utils/prisma");

const createDish = async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Nome e preço do prato são obrigatórios."
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        ownerId: req.user.id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Este utilizador ainda não possui restaurante cadastrado."
      });
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        restaurantId: restaurant.id,
        categoryId: categoryId ? Number(categoryId) : null
      },
      include: {
        restaurant: true,
        category: true
      }
    });

    return res.status(201).json({
      message: "Prato cadastrado com sucesso.",
      dish
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar prato."
    });
  }
};

const listDishes = async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      where: {
        isAvailable: true,
        restaurant: {
          isActive: true
        }
      },
      include: {
        restaurant: true,
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(dishes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pratos."
    });
  }
};

const listPopularDishes = async (req, res) => {
  try {
    const popularItems = await prisma.orderItem.groupBy({
      by: ["dishId"],
      _sum: {
        quantity: true
      },
      _count: {
        dishId: true
      },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      },
      take: 6
    });

    const dishIds = popularItems.map((item) => item.dishId);

    if (dishIds.length === 0) {
      const fallbackDishes = await prisma.dish.findMany({
        where: {
          isAvailable: true,
          restaurant: {
            isActive: true
          }
        },
        include: {
          restaurant: true,
          category: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 6
      });

      return res.json(
        fallbackDishes.map((dish) => ({
          ...dish,
          totalSold: 0,
          totalOrders: 0
        }))
      );
    }

    const dishes = await prisma.dish.findMany({
      where: {
        id: {
          in: dishIds
        },
        isAvailable: true,
        restaurant: {
          isActive: true
        }
      },
      include: {
        restaurant: true,
        category: true
      }
    });

    const dishesWithSales = dishes
      .map((dish) => {
        const salesInfo = popularItems.find((item) => item.dishId === dish.id);

        return {
          ...dish,
          totalSold: salesInfo?._sum?.quantity || 0,
          totalOrders: salesInfo?._count?.dishId || 0
        };
      })
      .sort((a, b) => b.totalSold - a.totalSold);

    return res.json(dishesWithSales);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pratos mais comprados."
    });
  }
};

const getDishById = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await prisma.dish.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        restaurant: true,
        category: true
      }
    });

    if (!dish) {
      return res.status(404).json({
        message: "Prato não encontrado."
      });
    }

    return res.json(dish);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar prato."
    });
  }
};

const listDishesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const dishes = await prisma.dish.findMany({
      where: {
        restaurantId: Number(restaurantId)
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(dishes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pratos do restaurante."
    });
  }
};

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, isAvailable, categoryId } =
      req.body;

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

    const dish = await prisma.dish.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!dish) {
      return res.status(404).json({
        message: "Prato não encontrado."
      });
    }

    if (dish.restaurantId !== restaurant.id) {
      return res.status(403).json({
        message: "Não pode editar pratos de outro restaurante."
      });
    }

    const updatedDish = await prisma.dish.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        description,
        price: price ? Number(price) : undefined,
        imageUrl,
        isAvailable,
        categoryId: categoryId ? Number(categoryId) : undefined
      },
      include: {
        restaurant: true,
        category: true
      }
    });

    return res.json({
      message: "Prato actualizado com sucesso.",
      dish: updatedDish
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao actualizar prato."
    });
  }
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

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

    const dish = await prisma.dish.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!dish) {
      return res.status(404).json({
        message: "Prato não encontrado."
      });
    }

    if (dish.restaurantId !== restaurant.id) {
      return res.status(403).json({
        message: "Não pode remover pratos de outro restaurante."
      });
    }

    await prisma.dish.delete({
      where: {
        id: Number(id)
      }
    });

    return res.json({
      message: "Prato removido com sucesso."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao remover prato."
    });
  }
};

module.exports = {
  createDish,
  listDishes,
  listPopularDishes,
  getDishById,
  listDishesByRestaurant,
  updateDish,
  deleteDish
};