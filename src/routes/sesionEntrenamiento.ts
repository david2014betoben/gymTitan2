import { Router } from "express";
import { sesionEntrenamientoController } from "../controllers/sesionEntrenamiento.controller";

const router = Router();

router.get("/", sesionEntrenamientoController.getAll);

router.get("/:id", sesionEntrenamientoController.getById);

router.post("/", sesionEntrenamientoController.create);

router.put("/:id", sesionEntrenamientoController.update);

router.get(
  "/entrenador/:entrenadorId",
  sesionEntrenamientoController.getSesionesDelDia,
);

router.patch("/:id/estado", sesionEntrenamientoController.actualizarEstado);

router.get(
  "/entrenador/:entrenadorId/completadas",
  sesionEntrenamientoController.contarSesionesCompletadas,
);

export default router;
