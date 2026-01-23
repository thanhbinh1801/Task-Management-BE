// import { Server, Socket } from "socket.io";
// import { Server as HTTPServer } from "http";

// class NotificationGateway {
//   constructor(
//     private server: Server | null = null,
//     private readonly connectedUser = new Map<string, Set<string>>(),
//     private readonly socketToUser = new Map<string, string>()
//   ) {}

//   initialize(httpServer: HTTPServer) {
//     this.server = new Server(httpServer, { });
//     this.server.use( (socket, next) => {
//       socket.data.userId = "123456";
//       next();
//     });
//     this.server.on('connection', (socket) => this.handleConnection(socket))
//   }

//   async handleConnection(client: Socket) {
//     console.log("client id: ", client.id);
//     const userId = client.data.userId as string;
//     this.connectedUser.set(
//       userId,
//       this.connectedUser.get(userId) ? this.connectedUser.get(userId)!.add(client.id) : new Set(client.id)
//     );
//     this.socketToUser.set(
//       client.id,
//       userId
//     );
//     this.server?.emit("connected", "connectedd");
//     this.server?.on("disconnect", () => this.handleDisconnection(client));
//   }

//   async handleDisconnection( client: Socket) {}

//   async sendMessageToUser({userId, message }: {userId: string, message: string}) {
//     const socketIds = this.connectedUser.get(userId);

//     if(socketIds) {
//       for ( const socketId of socketIds) {
//         this.server?.to(socketId).emit('notification', message)
//       }
//     }
//   }
// }

// export default new NotificationGateway();

import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { appEnv } from "@/configs";
import { NotificationEvent, SocketAuthData } from "./dtos/events/notification-event.dtos";
import { UnauthorizedException } from "../../commons";

class NotificationGateway {
    private server: Server | null = null;
    private readonly connectedUser = new Map<string, Set<string>>();
    private readonly socketToUser = new Map<string, string>();

    initialize(httpServer: HTTPServer) {
        this.server = new Server(httpServer, {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:3001'],
                credentials: true,
            },
            path: "/socket.io"
        });

        // Middleware xu ly xac thuc socket, fix lai bo vao middleware chung
        this.server.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
                if (!token) {
                    return next(new UnauthorizedException('No token provided'));
                }

                const decode = jwt.verify(token, appEnv.JWT_SECRET) as SocketAuthData;

                socket.data.userId = decode.userId;
                socket.data.email = decode.email;
                next();
            } catch (error) {
                next(new UnauthorizedException('Invalid token'));
            }
        });

        this.server.on('connection', (socket) => this.handleConnection(socket));

        console.log("Notification Gateway initialized");
    }

    private async handleConnection(socket: Socket) {
        const userId = socket.data.userId as string;

        // them socket vao danh sach user ket noi
        if (!this.connectedUser.has(userId)) {
            this.connectedUser.set(userId, new Set());
        }
        this.connectedUser.get(userId)!.add(socket.id);
        this.socketToUser.set(socket.id, userId);

        socket.emit("connected", { userId, socketId: socket.id });
        socket.on('disconnect', () => this.handleDisconnection(socket));
    }

    private async handleDisconnection(socket: Socket) {
        const userId = this.socketToUser.get(socket.id);

        if (userId) {
            const userSockets = this.connectedUser.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    this.connectedUser.delete(userId);
                }
            }
            this.socketToUser.delete(socket.id);
        }
        console.log(`User disconnected: ${userId} | Socket ID: ${socket.id}`);
    }

    sendToUser(userId: string, event: NotificationEvent, data: any) {
        const socketIds = this.connectedUser.get(userId);
        if (socketIds && socketIds.size > 0) {
            for (const socketId of socketIds) {
                this.server?.to(socketId).emit(event, data);
            }

            console.log(`Sent ${event} to user ${userId} (${socketIds.size} sockets)`);
        } else {
            console.log(`User ${userId} is not connected`);
        }
    }

    sendToMultipleUsers(userIds: string[], event: NotificationEvent, data: any) {
        userIds.forEach((userId) => this.sendToUser(userId, event, data));
    }

    // Broadcast cho all users trong room
    broadcastToRoom(room: string, event: NotificationEvent, data: any) {
        this.server?.to(room).emit(event, data);
    }

    // User join room (board, workspace)
    joinRoom(userId: string, room: string) {
        const socketIds = this.connectedUser.get(userId);
        if (socketIds) {
            for (const socketId of socketIds) {
                this.server?.in(socketId).socketsJoin(room);
            }
        }
    }

    // User leave room
    leaveRoom(userId: string, room: string) {
        const socketIds = this.connectedUser.get(userId);
        if (socketIds) {
            for (const socketId of socketIds) {
                this.server?.in(socketId).socketsLeave(room);
            }
        }
    }

    // Lay so luong user online
    getOnlineUsersCount(): number {
        return this.connectedUser.size;
    }

    isUserOnline(userId: string): boolean {
        return this.connectedUser.has(userId);
    }
}

export default new NotificationGateway();