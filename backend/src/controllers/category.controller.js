const prisma = require("../utils/prisma");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "O nome da categoria é obrigatório."
      });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { name }
    });

    if (categoryExists) {
      return res.status(400).json({
        message: "Esta categoria já existe."
      });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return res.status(201).json({
      message: "Categoria criada com sucesso.",
      category
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar categoria."
    });
  }
};

const listCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return res.json(categories);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar categorias."
    });
  }
};

module.exports = {
  createCategory,
  listCategories
};