import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API - tickets y usuarios",
    description: "Documentacion del sistema de tickets",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  definitions: {
    Rol: {
      "@enum": ["ADMINISTRACION", "RECEPCION", "ENTRENADOR"],
      example: "RECEPCION",
    },
    EstadoSesion: {
      "@enum": ["PROGRAMADA", "ASISTIO", "FALTO"],
    },
  },
};

const outputFile = "./src/config/swagger-output.json";

const routes = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
