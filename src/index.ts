/* eslint-disable @typescript-eslint/no-misused-promises */
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { SwaggerTheme } from "swagger-themes";

import { openApiDocument } from "./openapi";
import { appRouter, createContext } from "./router";

const app = express();

// Swagger Theme
const theme = new SwaggerTheme("v3");
const options = {
  explorer: true,
  customCss: theme.getBuffer("dark"),
};

// Setup CORS
app.use(cors());

// Handle incoming tRPC requests
app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext })
);
// Handle incoming OpenAPI requests
app.use(
  "/api",
  createOpenApiExpressMiddleware({ router: appRouter, createContext })
);

// Serve Swagger UI with our OpenAPI schema
app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(openApiDocument, options));

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
