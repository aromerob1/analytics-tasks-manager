import { User } from "../models/user.model";
import { UserAttributes } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const registerUser = async (userData: UserAttributes) => {
  const { email, password } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  // Crear usuario
  const newUser = await User.create({ email, password });
  return generateToken(newUser);
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return generateToken(user);
};

// Función para generar JWT
const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
};