const express = require("express");
const socket = require("socket.io");
const Game = require("./models/Game");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");



//localStorage.getItem("jwtToken");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser()); // ✅ Enable cookie parsing


const chess = new Chess();
let players = {};
let currentPlayer = "W";

// Store in .env
const SECRET_KEY = "your_secret_key";
// Dummy user database (replace with real DB)
const users = [
    
];

app.get('/', (req, res) => {
    res.render("lobby");
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/game", (req, res) => {
    const token = req.cookies.jwtToken; 

    if (!token) return res.redirect("/login");

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.render("index", { username: decoded.username }); // ✅ Pass username to EJS
    } catch {
        res.clearCookie("jwtToken"); // Clear invalid token
        return res.redirect("/login");
    }
});



app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Game.findOne({ username });
    

    if (!user || password !== user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // ✅ Store JWT in an HTTP-only cookie
    res.cookie("jwtToken", token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiry
    res.redirect("/game"); 
})



io.on("connection", function (uniquesocket) {
    console.log("connected");

    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id === players.white) {
            delete players.white;

        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    uniquesocket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen())
            }
            else {
                console.log("Invalid move : ", move);
                uniquesocket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("Invalid move : ", move);
        }
    });
});

server.listen(4000, function () {
    console.log("listening on port 4000");
});