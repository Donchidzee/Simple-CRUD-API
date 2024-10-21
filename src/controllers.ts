import { ServerResponse, IncomingMessage } from 'http';
import { users } from './database';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

import { validate as isUuid, v4 as uuidv4 } from 'uuid';

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID format' }));
    return;
  }

  const user = users.find((u) => u.id === id);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || !age || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        return;
      }

      const newUser = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      users.push(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
};

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID format' }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || !age || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        return;
      }

      const updatedUser = { id, username, age, hobbies };
      users[userIndex] = updatedUser;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
};

export const deleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID format' }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  users.splice(userIndex, 1);
  res.writeHead(204);
  res.end();
};
