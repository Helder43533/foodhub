const prisma = require("../utils/prisma");

const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "O nome do restaurante é obrigatório."
      });
    }

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: {
        ownerId: req.user.id
      }
    });

    if (existingRestaurant) {
      return res.status(400).json({
        message: "Este utilizador já possui um restaurante cadastrado."
      });
    }

   const restaurant = await prisma.restaurant.create({
    data: {
      name,
      description,
      address,
      phone,
      isActive: false,
      ownerId: req.user.id
    }
    });

    return res.status(201).json({
      message: "Restaurante cadastrado com sucesso. Aguarde aprovação do administrador.",
      restaurant
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar restaurante."
    });
  }
};

const listRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dishes: true
      },
      orderBy: {
        name: "asc"
      }
    });

    return res.json(restaurants);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar restaurantes."
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dishes: {
          include: {
            category: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurante não encontrado."
      });
    }

    return res.json(restaurant);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar restaurante."
    });
  }
};

const updateRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "O campo isActive deve ser true ou false."
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurante não encontrado."
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: Number(id)
      },
      data: {
        isActive
      }
    });

    return res.json({
      message: "Estado do restaurante actualizado com sucesso.",
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao actualizar estado do restaurante."
    });
  }
};

module.exports = {
  createRestaurant,
  listRestaurants,
  getRestaurantById,
  updateRestaurantStatus
};