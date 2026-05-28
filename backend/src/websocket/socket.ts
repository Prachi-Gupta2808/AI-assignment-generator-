import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface Client {
  assignmentId: string;
  ws: WebSocket;
}

let clients: Client[] = [];

export const initWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection!");

    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.assignmentId) {
          clients.push({ assignmentId: data.assignmentId, ws });
          console.log(`Client subscribed to assignment: ${data.assignmentId}`);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      clients = clients.filter((c) => c.ws !== ws);
      console.log("Client disconnected");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      clients = clients.filter((c) => c.ws !== ws);
    });
  });

  console.log("WebSocket server started!");
};

export const notifyClient = (assignmentId: string, data: any) => {
  clients.forEach((client) => {
    if (
      client.assignmentId === assignmentId &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(JSON.stringify(data));
    }
  });

  if (data && (data.status === "completed" || data.status === "failed")) {
    clients = clients.filter((c) => c.assignmentId !== assignmentId);
  }
};
