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
GET ``/todos`` — List all todos

POST ``/todos`` — Create new todo
* Body: ```{ "text": "My new task" }```

PUT ``/todos/:id`` — Update a todo
* Body (partial or full): ```{ "text": "Updated", "completed": true }```

DELETE ``/todos/:id`` — Delete a todo

# Connecting to Database
1. Download [DBeaver Community](https://dbeaver.io/).
2. Create a new SQLite connection (install the driver if necessary).
3. Go to SQL Editor > Open SQL Console
4. Have fun running your queries!

# Chatbot Integration
1. Go to the [Chutes Page](https://chutes.ai/).
2. Select DeepSeek V3 0324 (free).
3. Under the API tab, look for the `Need an API token?` section and click on `Get one here`.
4. Create an API key and save it.
5. Create an `.env` on the `be` folder.
6. Add `CHUTES_API_KEY=your_api_key` where `your_api_key` is the key you obtained at Chutes. Save.
