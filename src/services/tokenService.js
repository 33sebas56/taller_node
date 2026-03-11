import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const generarAccessToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15s"
    }
  );
};

export const generarRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

export const verificarAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};