import type { Request, Response } from "express";
import { sesionEntrenamientoModel } from "../models/sesionEntrenamiento.model";
import { prisma } from "../config/prisma";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  /* 
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Obtener todas las sesiones creadas"
  #swagger.description = "Obtiene todas las sesiones creadas."
*/
  try {
    const sesiones = await sesionEntrenamientoModel.getAll();

    res.status(200).json(sesiones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las sesiones de entrenamiento",
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  /* 
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Obtener una sesión de entrenamiento"
  #swagger.description = "Obtiene los detalles de una sesión de entrenamiento mediante su ID."
*/
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
};

export const create = async (req: Request, res: Response): Promise<void> => {
  /*
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Agendar una sesión de entrenamiento"
  #swagger.description = "Permite agendar una sesión personalizada para un socio con un entrenador específico en una fecha y hora determinada."
  */
  try {
    const { socioId, entrenadorId, fechaHora } = req.body;

    const socio = await prisma.socio.findUnique({
      where: {
        id: socioId,
      },
    });

    if (!socio) {
      res.status(404).json({
        message: "El socio no existe",
      });
      return;
    }

    const entrenador = await prisma.usuario.findUnique({
      where: {
        id: entrenadorId,
      },
    });

    if (!entrenador) {
      res.status(404).json({
        message: "El entrenador no existe",
      });
      return;
    }

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
};
export const update = async (req: Request, res: Response): Promise<void> => {
  /* 
    #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Actualizar una sesión"
  #swagger.description = "Actualiza los datos de una sesión de entrenamiento previamente registrada."

  #swagger.parameters["id"] = {
    in: "path",
    required: true,
    type: "integer",
    description: "ID de la sesión de entrenamiento",
    example: 1
  }
  */
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
};

export const getSesionesDelDia = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /* 
    #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Obtener mis sesiones del día"
  #swagger.description = "Obtiene las sesiones de entrenamiento del entrenador autenticado correspondientes a una fecha determinada."

  #swagger.parameters["fecha"] = {
    in: "query",
    required: true,
    type: "string",
    format: "date",
    description: "Fecha de la jornada que se desea consultar",
    example: "2026-09-10"
  }
  */
  try {
    const entrenadorId = req.user!.id;
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
};

export const actualizarEstado = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /* 
    #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Registrar asistencia de una sesión"
  #swagger.description = "Permite al entrenador registrar si el socio asistió o faltó a una sesión de entrenamiento."

  #swagger.parameters["id"] = {
    in: "path",
    required: true,
    type: "integer",
    description: "ID de la sesión de entrenamiento",
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["estado"],
          properties: {
            estado: {
              type: "string",
              enum: ["ASISTIO", "FALTO"],
              example: "ASISTIO",
              description: "Estado de asistencia del socio"
            }
          }
        }
      }
    }
  }
  */
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (estado !== "ASISTIO" && estado !== "FALTO") {
      res.status(400).json({
        message: "El estado debe ser ASISTIO o FALTO",
      });
      return;
    }

    const sesion = await sesionEntrenamientoModel.actualizarEstado(id, estado);

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
};

export const contarSesionesCompletadas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /* 
    #swagger.security = [{ "bearerAuth": [] }]
  #swagger.tags = ["Sesiones de Entrenamiento"]
  #swagger.summary = "Contar sesiones completadas por entrenador"
  #swagger.description = "Obtiene la cantidad de sesiones completadas por un entrenador para el cálculo de sus honorarios."

  #swagger.parameters["entrenadorId"] = {
    in: "path",
    required: true,
    type: "integer",
    description: "ID del entrenador",
    example: 3
  }
  */
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
};
