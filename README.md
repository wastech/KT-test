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

The Wallet API uses a MongoDB database with two main collections to store user and transaction data.

### Users

The `users` collection stores user profiles and related information. Here are the key fields:

- **id** (integer, primary key): Unique identifier for each user.
- **fullname** (varchar): User's full name.
- **role** (varchar): User's role or access level.
- **phone_number** (varchar): User's phone number.
- **balance** (integer): User's wallet balance.
- **wallet_id** (varchar): Unique identifier for the user's wallet.
- **email** (varchar): User's email address.
- **password** (varchar): Encrypted password for authentication.
- **created_at** (timestamp): Timestamp indicating when the user was created.
- **pin** (integer): User's personal identification number (PIN) for security.
- **confirmPassword** (varchar): Confirmation of the user's password during registration.

### Transactions

The `transactions` collection stores transaction records between users. Here are the key fields:

- **id** (integer, primary key): Unique identifier for each transaction.
- **senderAccountId** (varchar, references `users.id`): Identifies the sender of the transaction.
- **amount** (float): The amount of money transferred in the transaction.
- **receiverAccountId** (varchar, references `users.id`): Identifies the recipient of the transaction.
- **pin** (integer): User's PIN for verification.
- **otp** (varchar): One-time password (OTP) used for transaction verification.
- **transactionType** (varchar): Indicates the type of transaction (e.g., 'sent' or 'received').
- **status** (varchar): Status of the transaction (e.g., 'Success' or 'Failed').

### Database Schema Diagram

![P2P-Transaction](https://github.com/wastech/KT-test/assets/56930241/620d5e0c-a3fd-4c3f-8c76-aa1aa9475a43)

The diagram above provides a visual representation of the database schema, illustrating the relationships between the `users` and `transactions` collections.


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
