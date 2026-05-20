const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token não fornecido."
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        message: "Token inválido."
      });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
      return res.status(401).json({
        message: "Formato do token inválido."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Utilizador não encontrado."
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado."
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Acesso negado."
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles
};