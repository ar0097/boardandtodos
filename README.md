🗂️ Board & Todos Application

A full-stack MERN-style application that allows users to create boards and manage todos inside each board.
Includes authentication, board management, and todo CRUD operations.

🚀 Live URLs

Frontend

👉 https://boardandtodos-fhnt.vercel.app/

Backend

👉 https://boardandtodos.vercel.app/

📦 GitHub Repository

git clone https://github.com/ar0097/boardandtodos.git

⚙️ Backend Setup

cd backend

npm install

node index.js

Backend will run on:

http://localhost:5000

🎨 Frontend Setup

cd frontend

npm install

npm start

Frontend will run on:

http://localhost:3000

🛠️ Tech Stack

Frontend

React

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB

JWT Authentication

Vercel Deployment


🔐 Environment Variables (Backend)

Create a .env file inside backend/:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key


⚠️ Do not push .env to GitHub

📌 API Endpoints

🔑 Authentication

Method	and Endpoint	

POST	/api/auth/register	

POST	/api/auth/login	

📋 Boards
Method and	Endpoint	

GET	/api/boards	

POST	/api/boards	

PUT	/api/boards/:boardId	

DELETE	/api/boards/:boardId	

✅ Todos

Method and	Endpoint	

GET	/api/todos/:boardId	

POST	/api/todos	

PUT	/api/todos/:todoId

DELETE	/api/todos/:todoId

🧠 Example Flow (Boards & Todos)

User registers & logs in

User creates a Board (e.g. "Work")

Inside the board, user creates Todos

"Finish assignment"

"Submit report"

Todos belong to a specific board

🧪 API Testing

You can test APIs using:

Postman

Thunder Client

Use JWT token in headers:

Authorization: Bearer <your_token>

🧾 Scripts

Backend

node index.js

Frontend

npm start