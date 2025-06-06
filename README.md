# Task Manager API (MongoDB Backend)

A REST API for managing tasks with MongoDB.

## Features
- CRUD operations with Mongoose
- Filter tasks by completion status
- Input validation
- Automatic timestamps

## Setup
1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
## Data Storage Options
- **MongoDB** (default): Set `MONGODB_URI` in `.env`.
- **Local JSON**: Set `USE_MONGO=false` and use `tasks.json`.