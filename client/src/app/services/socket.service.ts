import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';

const SocketIoConfig = { url: environment.mainserver, options: {} };
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  constructor() {
    this.socket = null;
  }

  connectSocketServer(userId: string) {
    const socket = socketIo.connect(environment.mainserver, { query: `userId=${userId}`, transports: ['websocket'], upgrade: false });
    this.socket = socket;
  }

  socketEmit(eventName, params) {
    if (this.socket == null) {
      this.initiateSocket();
    }
    this.socket.emit(eventName, params);
  }

  public socketOn(event: string,): Observable<any> {
    return new Observable<Event>(observer => {
        this.socket.on(event, (response) => observer.next(response));
    });
  }
  /**
  socketOn(eventName, callback) {
    if (this.socket == null) {
      this.initiateSocket();
    }
    this.socket.on(eventName, (response) => {
      if (callback) {
        callback(response);
      }
    });
  }
*/
  private initiateSocket() {
    var currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      var curerntUserObject = JSON.parse(currentUser);
      this.connectSocketServer(curerntUserObject.id);
    }
  }
}
