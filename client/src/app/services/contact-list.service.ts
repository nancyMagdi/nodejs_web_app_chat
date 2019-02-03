import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  private curerntUserObject: any;

  constructor(private http: HttpClient) { 
  }

  getCurrentUserId(){
    this.curerntUserObject = JSON.parse(localStorage.getItem("currentUser"));    
  }

  addContact(newContactId: number) {
    this.getCurrentUserId();
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
    this.getCurrentUserId();
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
    this.getCurrentUserId();
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

  //  search for a contact route in server and in client
  searchContact(curerntUserObjectId:number,searched:string) {    
    this.getCurrentUserId();
    let promise = new Promise((resolve, reject) => {
      this.http.get("/contactList/searchUsers/" + curerntUserObjectId+"/"+searched).subscribe((ret: any) => {
        resolve(ret.data);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }
}
