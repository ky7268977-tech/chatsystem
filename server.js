import express from "express";
import http from "http";
import {initWebSocket, getAllConnectedUsers} from "./src/websocket.js";

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

initWebSocket(server);

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    console.log("Signaling server running on", PORT);
});


app.get("/users", (req, res) => {
    const allUsers = getAllConnectedUsers();
    res.send(allUsers); // ["user1", "user2", ...]
});