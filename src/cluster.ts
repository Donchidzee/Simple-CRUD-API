// In src/cluster.ts
import cluster from 'cluster';
import os from 'os';
import http from 'http';
import dotenv from 'dotenv';
import { router } from './router';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = os.availableParallelism
  ? os.availableParallelism() - 1
  : os.cpus().length - 1;

const workers: number[] = [];

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 1; i <= numCPUs; i++) {
    const workerPort = PORT + i;
    cluster.fork({ PORT: workerPort });
    workers.push(workerPort);
  }

  let currentWorker = 0;

  // Load balancer
  const server = http.createServer((req, res) => {
    const workerPort = workers[currentWorker];
    currentWorker = (currentWorker + 1) % workers.length;

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (r) => {
      res.writeHead(r.statusCode || 500, r.headers);
      r.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
  });

  server.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  // Workers
  const workerPort = Number(process.env.PORT);
  const server = http.createServer((req, res) => {
    router(req, res);
  });

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} started on port ${workerPort}`);
  });
}
