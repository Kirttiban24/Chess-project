# ♟️ Real-Time Multiplayer Chess Game

A full-stack web-based chess game built with Node.js, Express.js, Socket.io, MongoDB, and EJS.  
Features real-time gameplay, secure JWT-based authentication, a dynamic lobby system, and move validation using Chess.js.

---

## 🚀 Features

- Real-time multiplayer gameplay with Socket.io  
- JWT-based user authentication with secure session handling  
- Lobby system to create or join game rooms  
- Move validation and game rules using Chess.js  
- Responsive UI designed with Tailwind CSS  
- MongoDB integration for user data and game state management  

---

## 🔐 Login Page Note

The login system is connected to MongoDB and validates credentials against existing users in the database.  
**Random or unregistered usernames and passwords will not work.**

To test the application, use the following demo credentials:

- Username: `admin` 
- Password:  `password123`

- Username: `user1`
- Password: `mypassword`

*(You can update these credentials in the database if needed.)*

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Frontend:** EJS, Tailwind CSS  
- **Real-time:** Socket.io  
- **Auth:** JWT, bcrypt  
- **Game Logic:** Chess.js  

---

## 🧩 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kirttiban24/Chess-project.git
