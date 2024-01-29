import { NextApiResponseServerIO } from "@/types";
import { SOCKET_PORT } from "@/config/app";
import { Server as ServerIO } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    },
};

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

export default function SocketHandler(
    _req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (res.socket.server.io) {
        res.status(200).json({
            message: "Socket is already running",
        });
        return;
    }

    const path = "/api/socket";
    const httpServer = res.socket.server as any;
    console.log("Starting Socket.IO server on port:", SOCKET_PORT);
    const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
        cors: {
            origin: "*",
        },
    }).listen(SOCKET_PORT);
    io.on("connect", (socket) => {
        console.log("⚡ connected ID", socket.id);
        socket.on("disconnect", async () => {
            console.log("socket disconnect");
        });
    });
    res.socket.server.io = io;
    res.status(201).json({
        message: "Socket is started",
        socket: `:${SOCKET_PORT}`,
    });
}
