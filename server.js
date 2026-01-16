import express from "express";
import http from "http";
import {initWebSocket, getAllConnectedUsers} from "./src/websocket.js";

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

initWebSocket(server);

server.listen(3000, () => {
    console.log("🚀 Chat server running at http://localhost:3000");
});

app.get("/users", (req, res) => {
    const allUsers = getAllConnectedUsers();
    res.send(allUsers); // ["user1", "user2", ...]
});