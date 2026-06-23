import express from 'express';
import routes from './routes';
import { requestLogger } from './shared/middleware/request-logger';
import { errorHandler } from './shared/middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', routes);

  app.use(errorHandler);
  return app;
}
