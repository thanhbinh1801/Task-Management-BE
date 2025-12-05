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