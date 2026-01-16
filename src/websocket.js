import {WebSocketServer} from "ws";
import url from "url";

const users = new Map();

export function initWebSocket(server) {
    const wss = new WebSocketServer({server});

    wss.on("connection", (ws, req) => {

        const parsedUrl = url.parse(req.url, true);
        const userId = parsedUrl.query.userId;
        
        if (!userId) {
            ws.send(JSON.stringify({ error: "No userId provided" }));
            ws.close();
            return;
        }

        if (users.has(userId)) {
            ws.send(JSON.stringify({ error: "User already connected" }));
            ws.close();
            return;
        }

        users.set(userId, ws);
        ws.userId = userId;

        console.log("User connected: ", userId);

        ws.on("message", (data) => {
            try {
                const msg = JSON.parse(data.toString()); // parse JSON

                const targetWs = users.get(msg.to);
                if (targetWs) {
                    targetWs.send(JSON.stringify({
                        from: userId,
                        message: msg.message
                    }));
                }

                console.log("Message from", userId, "to", msg.to, ":", msg.message);

            } catch (err) {
                console.error("Invalid message format:", data.toString());
            }
        });

        ws.on("close", () => {
            console.log(`User disconnected: ${ws.userId}`);
            users.delete(ws.userId);
        });
    });
}

export function getAllConnectedUsers() {
    return Array.from(users.keys()); // sirf userIds
}