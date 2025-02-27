# Puul Back-End Test

This is an API with all CRUD operations for users and tasks.
Added filters for each entity.

## Installation

```bash
git clone
```

```bash
yarn install
```

## Seeding users schema

```bash
yarn seed
```

> [!NOTE]
> For now I omit to seed tasks schema as gets complex I'll provice examples how to use faker library to populate by your own.

## Configuration

> [!IMPORTANT]
> To connect to your database you need to create and populate a `.env` file.

`.env` file example

```bash
# PostgreSQL Database Configuration
DB_HOST=your_host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

## Running the app

```bash
# development
yarn start:dev
```

```bash
# production mode
yarn build && start:prod
```

> [!NOTE]
> By now the database should be populated if you seed the app, so you can start testing the users schema.

### Users schema

> [!IMPORTANT]
> The user endpoints are host on `/api/v1/user`

#### Create a user

```js
// POST /api/v1/user body example
{
  "name": "Some user name",
  "email": "some email",
  "role": "admin", // or "member"
  "password": "Admin1234" // This password is hashed before being stored in the database
}
```

#### Filter users

To filters the users you can use the following query params:

- filterByName
- filterByEmail
- filterByRole

> [!NOTE]
> Considrations with the filters
>
> - All the filters are optional.
> - You can combine multiple filters.
> - All filters goes as a query param.

### Tasks schema

#### Create a task

> [!IMPORTANT]
> The taks endpoints are host on `/api/v1/task`

```js
// POST /api/v1/task body example
{
  "title": "Task title",
  "description": "task description",
  "estimatedHours": 5, // any number
  "deadline": "09/12/2025", // use US date format mm/dd/yyyy
  "state": "completed", // enum type "completed" or "active"
  "costPerTask": 150, // any number
  "asignedUsers": [4, 2, 1] // array of user ids
}
```

#### Filter tasks

To filters the tasks you can use the following query params:

- filterByDeadline
- filterByTitle
- filterByUserId
- filterByUserName
- filterByUserEmail

> [!NOTE]
> Considrations with the filters
>
> - All the filters are optional.
> - You can combine multiple filters.
> - All filters goes as a query param.

### Metrics endpoints

> [!IMPORTANT]
> The metrics endpoints are host on `/api/v1/task/metrics`
> The metrics are `GET` requests.

#### Get task completion rate by user

endpoint `/api/v1/task/metrics/completion-rate`

##### Example of the response with faked data

```js
// An item of the array
{
  "userName": "Dr. Alejandro Balistreri",
  "completedTasks": 3,
  "inProgressTasks": 1,
  "totalTasks": 4,
  "completionRate": 75, // Aims to the percentage of completed tasks
  "totalCost": 480,
  "currentPayment": 450
}
```

#### Get task const efficiency by user

endpoint `/api/v1/task/metrics/costs`

##### Example of the response with faked data

```js
// An item of the array
{
    "userName": "Dr. Alejandro Balistreri",
    "estimatedHours": 20,
    "workedHours": 15,
    "completionRate": 75, // Aims to the percentage of the worked hours
    "costPerHour": 24
},
```
