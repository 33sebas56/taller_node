import { Router } from "express";
import { usuarios } from "../data/usuarios.js";
import { generateCode } from "../utils/generateCode.js";
import { enviarCodigo2FA } from "../services/emailService.js";
import { generarAccessToken, generarRefreshToken } from "../services/tokenService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/login-paso1", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y password son obligatorios"
      });
    }

    const usuario = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      });
    }

    const codigo = generateCode();
    const expira = Date.now() + 5 * 60 * 1000;

    usuario.codigo2FA = codigo;
    usuario.codigo2FAExpira = expira;

    await enviarCodigo2FA(usuario.correo, codigo);

    return res.status(200).json({
      mensaje: "Codigo 2FA enviado al correo"
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al procesar login paso 1",
      error: error.message
    });
  }
});

router.post("/login-paso2", (req, res) => {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({
        mensaje: "Correo y codigo son obligatorios"
      });
    }

    const usuario = usuarios.find((u) => u.correo === correo);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (!usuario.codigo2FA || !usuario.codigo2FAExpira) {
      return res.status(400).json({
        mensaje: "No hay un codigo 2FA generado para este usuario"
      });
    }

    if (Date.now() > usuario.codigo2FAExpira) {
      usuario.codigo2FA = null;
      usuario.codigo2FAExpira = null;

      return res.status(401).json({
        mensaje: "Codigo expirado"
      });
    }

    if (usuario.codigo2FA !== codigo) {
      return res.status(401).json({
        mensaje: "Codigo incorrecto"
      });
    }

    const accessToken = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken();

    usuario.refreshToken = refreshToken;
    usuario.refreshTokenExpira = Date.now() + 24 * 60 * 60 * 1000;

    usuario.codigo2FA = null;
    usuario.codigo2FAExpira = null;

    return res.status(200).json({
      mensaje: "Autenticacion exitosa",
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al procesar login paso 2",
      error: error.message
    });
  }
});

router.post("/refresh-token", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        mensaje: "Refresh token requerido"
      });
    }

    const usuario = usuarios.find((u) => u.refreshToken === refreshToken);

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Refresh token invalido"
      });
    }

    if (!usuario.refreshTokenExpira || Date.now() > usuario.refreshTokenExpira) {
      usuario.refreshToken = null;
      usuario.refreshTokenExpira = null;

      return res.status(401).json({
        mensaje: "Refresh token expirado"
      });
    }

    const nuevoAccessToken = generarAccessToken(usuario);

    return res.status(200).json({
      mensaje: "Nuevo access token generado",
      accessToken: nuevoAccessToken
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al refrescar token",
      error: error.message
    });
  }
});

router.get(
  "/mi-espacio",
  authMiddleware,
  roleMiddleware("estudiante"),
  (req, res) => {
    const usuario = usuarios.find((u) => u.id === req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Bienvenido a tu espacio",
      estudiante: usuario.nombre,
      librosPrestados: usuario.librosPrestados
    });
  }
);

router.get(
  "/dashboard-admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const inventarioBiblioteca = [
      { id: 1, titulo: "Cien años de soledad", stock: 5 },
      { id: 2, titulo: "Clean Code", stock: 3 },
      { id: 3, titulo: "El principito", stock: 8 },
      { id: 4, titulo: "1984", stock: 4 }
    ];

    return res.status(200).json({
      mensaje: "Bienvenido al dashboard del administrador",
      inventario: inventarioBiblioteca
    });
  }
);

export default router;