import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  public addUser(userData: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post("auth/signup", userData).subscribe((ret: any) => {
        resolve(ret);
      }, ((err) => {
        reject(err);
      })
      );
    })
    return promise;
  }

}
