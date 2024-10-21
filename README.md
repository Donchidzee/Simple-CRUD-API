# Simple CRUD API

A simple CRUD API built with Node.js and TypeScript, utilizing an in-memory database. It supports horizontal scaling using the Node.js Cluster API.

## Features

- **CRUD Operations**: Create, read, update, and delete users.
- **In-memory Database**: Data is stored in-memory.
- **Horizontal Scaling**: Supports multiple instances with load balancing.
- **Asynchronous API**: Uses async/await.
- **TypeScript**: For type safety.
- **Testing**: Includes tests using Mocha and Chai.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/simple-crud-api.git
   cd simple-crud-api

   ```

2. **Install Dependencies**

   ```bash
   npm install

   ```

3. **Set Up Environment Variables**

   ```bash
   PORT=4000
   ```

## Running the Application

### Development Mode

Starts the application with automatic restarts on code changes.

```bash
npm run start:dev
```

### Multi-instance Mode (Clustering)

Starts multiple instances with a load balancer.

```bash
npm run start:multi
```

## API Usage

### User Object Structure

- `id` (string, UUID) - auto-generated.
- `username` (string) - required.
- `age` (number) - required.
- `hobbies` (array of strings) - required (can be empty).

### Endpoints

#### GET /api/users

Retrieve all users.

```bash
curl -X GET http://localhost:4000/api/users
```

Retrieve a user by ID.

```bash
curl -X GET http://localhost:4000/api/users/{userId}
```

#### POST /api/users

Create a new user.

**Request Body**:

```json
{
  "username": "John Doe",
  "age": 30,
  "hobbies": ["reading", "swimming"]
}
```

#### PUT /api/users/{userId}

Update an existing user.

**Request Body**:

```json
{
  "username": "Jane Smith",
  "age": 25,
  "hobbies": ["drawing"]
}
```

#### DELETE /api/users/{userId}

Delete a user by ID.

```bash
curl -X DELETE http://localhost:4000/api/users/{userId}
```

## Testing

```bash
npm test
```

## Notes

- Use Node.js version **22.x.x** (22.9.0 or higher).
- In-memory database resets on application restart.
- Install all dependencies before running the application.
