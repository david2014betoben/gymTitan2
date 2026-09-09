import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export async function register(req: Request, res: Response) {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: { nombre, apellido, email, passwordHash: hashedPassword, rol },
      select: { id: true, email: true, rol: true },
    });

    res.status(201).json(user);
  } catch {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" },
    );

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}
