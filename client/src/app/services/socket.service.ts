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

  connectSocketServer(userId: string) {
    const socket = socketIo.connect( environment.mainserver ,{ query: `userId=${userId}` });
    this.socket = socket;
  }

  socketEmit(eventName, params) {
    if(this.socket == null){
      this.connectSocketServer(localStorage.getItem('username'));
    }
    this.socket.emit(eventName, params);
  }

  socketOn(eventName, callback) {
    if(this.socket == null){
      this.connectSocketServer(localStorage.getItem('username'));
    }
    this.socket.on(eventName, (response) => {
      if (callback) {
        callback(response);
      }
    });
  }
}
