import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Injectable } from "@nestjs/common";
import { Server } from "http";
import { Socket } from "socket.io";

@Injectable()
@WebSocketGateway({
  cors: "*",
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected ${client.id}`);
  }

  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: any): string {
    console.log("payload", payload);
    this.server.emit("subscribed", payload);
    return payload;
  }
}
