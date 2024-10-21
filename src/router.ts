// src/router.ts
import { IncomingMessage, ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './controllers';

export const router = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method || '';

  if (url === '/api/users' && method === 'GET') {
    getUsers(req, res);
  } else if (url.match(/\/api\/users\/([\w-]+)/) && method === 'GET') {
    const id = url.split('/')[3];
    getUserById(req, res, id);
  } else if (url === '/api/users' && method === 'POST') {
    createUser(req, res);
  } else if (url.match(/\/api\/users\/([\w-]+)/) && method === 'PUT') {
    const id = url.split('/')[3];
    updateUser(req, res, id);
  } else if (url.match(/\/api\/users\/([\w-]+)/) && method === 'DELETE') {
    const id = url.split('/')[3];
    deleteUser(req, res, id);
  } else {
    // Handle non-existing endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
