import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  { saveAs } from '../../../node_modules/file-saver';
//declare var saveAs:any;
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private curerntUserObject: any;
  constructor(private http: HttpClient) {
    let currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      this.curerntUserObject = JSON.parse(currentUser);
    }

  }

  getChatHistory(secondUserId: number, limit: number, offset: number) {
    let promise = new Promise((resolve, reject) => {
      this.http.get("/messages/getUsersChatHistory/" + this.curerntUserObject.id + "/" + secondUserId).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }

  pushFileToStorage(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post("/messages/saveFile", data).subscribe((ret: any) => {
        resolve(ret);
      }, ((err) => {
        reject(err);
      })
      );
  })
    return promise;
  }

downloadFile(fileName: string, threadId: number){
  let promise = new Promise((resolve, reject) => {
    this.http.get("/messages/downloadFile/" + threadId + "/" + fileName).subscribe((ret: any) => {
      saveAs(ret, fileName);
    }, ((err) => {
      reject(err);
    })
    );
  })
  return promise;
}
  
}
