import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private curerntUserObject: any;
  constructor(private http: HttpClient) {
   let currentUser =localStorage.getItem("currentUser")
    if(currentUser){
      this.curerntUserObject = JSON.parse(currentUser);
    }
    
  }

  getChatHistory(secondUserId: number, limit: number , offset : number ) {
    let promise = new Promise((resolve, reject) => {
      this.http.get("/messages/getUsersChatHistory/" + this.curerntUserObject.id+"/"+secondUserId).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }
}
