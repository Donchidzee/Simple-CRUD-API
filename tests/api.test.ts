import { expect } from 'chai';
import axios from 'axios';
import http from 'http';
import { AddressInfo } from 'net';
import { createServer } from '../src/server';

describe('Simple CRUD API Tests', function () {
  let server: http.Server;
  let baseURL: string;

  before((done) => {
    server = createServer();
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      baseURL = `http://localhost:${address.port}`;
      done();
    });
  });

  after((done) => {
    server.close(done);
  });

  let createdUserId: string;

  it('should GET all users (empty array expected)', async () => {
    const response = await axios.get(`${baseURL}/api/users`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array').that.is.empty;
  });

  it('should CREATE a new user', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'swimming'],
    };

    const response = await axios.post(`${baseURL}/api/users`, newUser);
    expect(response.status).to.equal(201);
    expect(response.data.username).to.equal(newUser.username);
    expect(response.data.age).to.equal(newUser.age);
    expect(response.data.hobbies).to.deep.equal(newUser.hobbies);
    expect(response.data).to.have.property('id');
    createdUserId = response.data.id;
  });

  it('should GET the created user by ID', async () => {
    const response = await axios.get(`${baseURL}/api/users/${createdUserId}`);
    expect(response.status).to.equal(200);
    expect(response.data.id).to.equal(createdUserId);
    expect(response.data.username).to.equal('John Doe');
    expect(response.data.age).to.equal(30);
    expect(response.data.hobbies).to.deep.equal(['reading', 'swimming']);
  });

  it('should UPDATE the created user', async () => {
    const updatedUser = {
      username: 'Jane Smith',
      age: 25,
      hobbies: ['drawing'],
    };

    const response = await axios.put(
      `${baseURL}/api/users/${createdUserId}`,
      updatedUser,
    );
    expect(response.status).to.equal(200);
    expect(response.data.id).to.equal(createdUserId);
    expect(response.data.username).to.equal(updatedUser.username);
    expect(response.data.age).to.equal(updatedUser.age);
    expect(response.data.hobbies).to.deep.equal(updatedUser.hobbies);
  });

  it('should DELETE the created user', async () => {
    const response = await axios.delete(
      `${baseURL}/api/users/${createdUserId}`,
    );
    expect(response.status).to.equal(204);
  });

  it('should return 404 when getting the deleted user', async () => {
    try {
      await axios.get(`${baseURL}/api/users/${createdUserId}`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('message', 'User not found');
    }
  });
});
