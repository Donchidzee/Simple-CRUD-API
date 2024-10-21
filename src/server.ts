import http from 'http';
import dotenv from 'dotenv';
import { router } from './router';

dotenv.config();

export const createServer = () => {
  const server = http.createServer((req, res) => {
    router(req, res);
  });
  return server;
};

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
