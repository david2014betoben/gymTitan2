import type { Request, Response } from "express";
import { sesionEntrenamientoModel } from "../models/sesionEntrenamiento.model";

export const sesionEntrenamientoController = {
  // Obtener todas las sesiones
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const sesiones = await sesionEntrenamientoModel.getAll();

      res.status(200).json(sesiones);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al obtener las sesiones de entrenamiento",
      });
    }
  },

  // Obtener una sesión por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const sesion = await sesionEntrenamientoModel.getById(id);

      if (!sesion) {
        res.status(404).json({
          message: "Sesión de entrenamiento no encontrada",
        });
        return;
      }

      res.status(200).json(sesion);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al obtener la sesión de entrenamiento",
      });
    }
  },

  // Agendar una sesión personalizada
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { socioId, entrenadorId, fechaHora } = req.body;

      const sesion = await sesionEntrenamientoModel.create({
        socioId,
        entrenadorId,
        fechaHora: new Date(fechaHora),
      });

      res.status(201).json({
        message: "Sesión de entrenamiento agendada correctamente",
        data: sesion,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al agendar la sesión de entrenamiento",
      });
    }
  },

  // Actualizar una sesión
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const { socioId, entrenadorId, fechaHora } = req.body;

      const data: {
        socioId?: number;
        entrenadorId?: number;
        fechaHora?: Date;
      } = {};

      if (socioId !== undefined) {
        data.socioId = socioId;
      }

      if (entrenadorId !== undefined) {
        data.entrenadorId = entrenadorId;
      }

      if (fechaHora !== undefined) {
        data.fechaHora = new Date(fechaHora);
      }

      const sesion = await sesionEntrenamientoModel.update(id, data);

      res.status(200).json({
        message: "Sesión de entrenamiento actualizada correctamente",
        data: sesion,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al actualizar la sesión de entrenamiento",
      });
    }
  },

  // Ver las sesiones del entrenador durante la jornada
  getSesionesDelDia: async (req: Request, res: Response): Promise<void> => {
    try {
      const entrenadorId = Number(req.params.entrenadorId);
      const { fecha } = req.query;

      if (!fecha || typeof fecha !== "string") {
        res.status(400).json({
          message: "Debe proporcionar una fecha",
        });
        return;
      }

      const inicio = new Date(`${fecha}T00:00:00`);
      const fin = new Date(`${fecha}T23:59:59.999`);

      const sesiones = await sesionEntrenamientoModel.getSesionesDelDia(
        entrenadorId,
        inicio,
        fin,
      );

      res.status(200).json(sesiones);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al obtener las sesiones del entrenador",
      });
    }
  },

  // Marcar asistencia o falta
  actualizarEstado: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;

      if (estado !== "ASISTIO" && estado !== "FALTO") {
        res.status(400).json({
          message: "El estado debe ser ASISTIO o FALTO",
        });
        return;
      }

      const sesion = await sesionEntrenamientoModel.actualizarEstado(
        id,
        estado,
      );

      res.status(200).json({
        message: "Estado de la sesión actualizado correctamente",
        data: sesion,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al actualizar el estado de la sesión",
      });
    }
  },

  // Cantidad de sesiones completadas por un entrenador
  contarSesionesCompletadas: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const entrenadorId = Number(req.params.entrenadorId);

      const total =
        await sesionEntrenamientoModel.contarSesionesCompletadas(entrenadorId);

      res.status(200).json({
        entrenadorId,
        sesionesCompletadas: total,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al contar las sesiones completadas",
      });
    }
  },
};
