import express, { type Request, type Response, type NextFunction } from "express";
import { json } from "express";
import { logger } from "./lib/logger";
import router from "./routes";

export { router as app };

const app = express();
app.use(json());
app.use(router);

if (require.main === module) {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

export default app;