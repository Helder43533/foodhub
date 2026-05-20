const prisma = require("../utils/prisma");

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        restaurant: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar utilizadores."
    });
  }
};

const listAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar todos os pedidos."
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalClients = await prisma.user.count({
      where: {
        role: "CLIENTE"
      }
    });

    const totalRestaurantsUsers = await prisma.user.count({
      where: {
        role: "RESTAURANTE"
      }
    });

    const totalRestaurants = await prisma.restaurant.count();
    const activeRestaurants = await prisma.restaurant.count({
      where: {
        isActive: true
      }
    });

    const totalCategories = await prisma.category.count();
    const totalDishes = await prisma.dish.count();
    const availableDishes = await prisma.dish.count({
      where: {
        isAvailable: true
      }
    });

    const totalOrders = await prisma.order.count();

    const pendingOrders = await prisma.order.count({
      where: {
        status: "PENDENTE"
      }
    });

    const deliveredOrders = await prisma.order.count({
      where: {
        status: "ENTREGUE"
      }
    });

    const cancelledOrders = await prisma.order.count({
      where: {
        status: "CANCELADO"
      }
    });

    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: {
          not: "CANCELADO"
        }
      }
    });

    return res.json({
      users: {
        total: totalUsers,
        clients: totalClients,
        restaurantsUsers: totalRestaurantsUsers
      },
      restaurants: {
        total: totalRestaurants,
        active: activeRestaurants
      },
      categories: totalCategories,
      dishes: {
        total: totalDishes,
        available: availableDishes
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      sales: {
        total: totalSales._sum.total || 0
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao carregar estatísticas."
    });
  }
};

module.exports = {
  listUsers,
  listAllOrders,
  getDashboardStats
};