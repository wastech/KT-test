# Wallet Transaction Management System


The Wallet Transaction Management System is a robust and secure web application built with NestJS, a powerful TypeScript framework for building scalable and efficient server-side applications. This system provides users with a convenient way to manage their digital wallet transactions, ensuring secure money transfers between users while maintaining detailed transaction logs.

## Features

- **User Authentication:** Secure user registration and login system with password hashing.
- **Transaction Creation:** Users can initiate transactions by providing recipient details, amount, PIN, and OTP verification.
- **Transaction Logs:** Detailed transaction logs with sender and receiver information, timestamps, and transaction types (sent or received).
- **PIN Verification:** Transactions require PIN verification for added security.
- **Swagger Documentation:** API endpoints are documented using Swagger UI for easy testing and integration.
- **Database Integration:** Utilizes MongoDB for efficient and scalable data storage.
- **Authorization and Authentication:** Role-based access control ensures only authorized users can access certain features.

## Database Schema

The Wallet API uses a MongoDB database with two main collections to store user and transaction data.

### Users

The `users` collection stores user profiles and related information.
### Transactions

The `transactions` collection stores transaction records between users.pp

### Database Schema Diagram

![P2P-Transaction](https://github.com/wastech/KT-test/assets/56930241/620d5e0c-a3fd-4c3f-8c76-aa1aa9475a43)

The diagram above provides a visual representation of the database schema, illustrating the relationships between the `users` and `transactions` collections.

### Stack
- [Node.js](https://nodejs.org/en)
- [Nest.js](https://nestjs.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)

 CMS API is built using Node.js, Express.js and Nest.js, with MongoDB as the database. I'm using the Mongoose library to interact with the database, and JWT for authentication.


## Swagger API Documentation

Swagger is a powerful tool that generates interactive API documentation, making it easier for developers to understand and interact with your API endpoints. You can access the Swagger documentation for this Wallet API by visiting the following URL:

[Swagger API Documentation](https://kt-test.onrender.com/api-docs#)




## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your development machine.
- MongoDB database set up and running.
- Clone this repository to your local machine
  
```bash
git@github.com:wastech/KT-test.git
```
 - Navigate to the project directory:


 - Run npm install to install the dependencies.

```bash
npm install
```
 - Create a .env file in the root directory and add the following variables

```bash 
PORT=<port number>
MONGODB_URI_LOCAL=<MongoDB URI>
JWT_SECRET=<JWT secret key>
JWT_EXPIRING_DATE=<JWT expiring date>
```
- Run npm start to start the server.

```bash
npm start

```

The API will be available at http://localhost:3000. You can test the API endpoints using a tool like Postman or curl.
