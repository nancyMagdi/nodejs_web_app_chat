import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  private curerntUserObject: any;

  constructor(private http: HttpClient) {
    this.curerntUserObject = JSON.parse(localStorage.getItem("currentUser"));    
  }

  addContact(newContactId: number) {
    let sentData = {
      "connectToUserId": newContactId,
      "userId": this.curerntUserObject.id
    }
    let promise = new Promise((resolve, reject) => {
      this.http.post("/contactList/addToContactList", sentData).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }

  getContactList() {
    let promise = new Promise((resolve, reject) => {
      this.http.get("/contactList/getContactList/" + this.curerntUserObject.id).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }

  getContactListOfChatHistory(curerntUserObjectId:number) {    
    let promise = new Promise((resolve, reject) => {
      this.http.get("/messages/getContactChatHistory/" + curerntUserObjectId).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }

  // TODO add search for a contact route in server and in client
}
