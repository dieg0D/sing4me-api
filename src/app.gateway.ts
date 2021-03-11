import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { updateLength } from './rooms/entities/room.entity';

const users: any = {};

const socketToRoom: any = {};

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('join room')
  joinRoom(client: Socket, roomID: string): void {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        client.emit('room full');
        return;
      }
      users[roomID].push(client.id);
    } else {
      users[roomID] = [client.id];
    }
    socketToRoom[client.id] = roomID;
    const usersInThisRoom = users[roomID].filter(
      (id: string) => id !== client.id,
    );

    client.emit('all users', usersInThisRoom);
    updateLength(roomID, users[roomID]?.length);
  }

  @SubscribeMessage('sending signal')
  sendingSignal(client: Socket, payload: any): void {
    client.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  }

  @SubscribeMessage('returning signal')
  returningSignal(client: Socket, payload: any): void {
    client.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: client.id,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const roomID = socketToRoom[client.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id: string) => id !== client.id);
      users[roomID] = room;
    }

    client.broadcast.emit('remove user', client.id);
    updateLength(roomID, users[roomID]?.length);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
