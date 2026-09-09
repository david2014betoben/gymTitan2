import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  getSesionesDelDia,
  actualizarEstado,
  contarSesionesCompletadas,
} from "../controllers/sesionEntrenamiento.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get("/", verifyToken, authorize("ENTRENADOR", "ADMINISTRACION"), getAll);

router.get(
  "/:id",
  verifyToken,
  authorize("RECEPCION", "ADMINISTRACION"),
  getById,
);

router.post("/", verifyToken, authorize("RECEPCION", "ADMINISTRACION"), create);

router.put("/:id", verifyToken, authorize("ADMINISTRACION"), update);

router.get(
  "/entrenador/:entrenadorId",
  verifyToken,
  authorize("ADMINISTRACION", "ENTRENADOR"),
  getSesionesDelDia,
);

router.patch(
  "/:id/estado",
  verifyToken,
  authorize("ENTRENADOR", "ADMINISTRACION"),
  actualizarEstado,
);

router.get(
  "/entrenador/:entrenadorId/completadas",
  verifyToken,
  authorize("ADMINISTRACION"),
  contarSesionesCompletadas,
);

export default router;
