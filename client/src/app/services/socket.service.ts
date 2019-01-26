import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import * as socketIo from 'socket.io-client';

const SocketIoConfig = { url:environment.mainserver, options: {} };
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  constructor() {
    this.socket = null;
  }

  connectSocketServer(userName: string) {
    const socket = socketIo.connect( environment.mainserver ,{ query: `userName=${userName}` });
    this.socket = socket;
  }

  socketEmit(eventName, params) {
    this.socket.emit(eventName, params);
  }

  socketOn(eventName, callback) {
    this.socket.on(eventName, (response) => {
      if (callback) {
        callback(response);
      }
    });
  }
}
