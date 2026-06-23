import { createApp } from './app';
import { env } from './config';
import { logger } from './shared/utils/logger';

const app = createApp();

app.listen(env.port, () => {
  logger.info(`EduLedger API listening on :${env.port} (${env.nodeEnv})`);
});
