# Getting Started with Todo List

This is a sample Todo List App I've created for teaching manual QA to newcomers, so they can get to experience the whole dataflow from the UI, the API and the DB and vice versa.

It's a minimalist app created with React, Express.js and SQLite.

<img width="611" alt="image" src="https://github.com/user-attachments/assets/3e24bf93-5c5e-4850-a4e7-1768d6ca5b36" />

# Prerequisites
[Install Node.js](https://nodejs.org/en/download)

# Backend
1. ``cd be``
2. ``npm install``
3. ``npm start``

# Frontend
1. ``cd fe``
2. ``npm install``
3. ``npm start``

# API documentation
* GET ``/todos`` to read all tasks
* POST ``/todos`` to create a task
* PUT ``/todos/:id`` to update completion or text
* DELETE ``/todos/:id`` to remove a task

Example:

PUT ``/todos/123``
```
{
    "completed": true
}
```

# Connecting to Database
1. Download [DBeaver Community](https://dbeaver.io/).
2. Create a new SQLite connection (install the driver if necessary).
3. Go to SQL Editor > Open SQL Console
4. Have fun running your queries!
