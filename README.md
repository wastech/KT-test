# Wallet Transaction Management System

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

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

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your development machine.
- MongoDB database set up and running.
- Clone this repository to your local machine
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
