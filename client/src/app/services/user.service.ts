import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userData: BehaviorSubject<any>;
  constructor(private _http: HttpClient) {
    this.userData = new BehaviorSubject(null);
    if (localStorage.getItem('token')) {
      var username = localStorage.getItem('username');
      this.getUserdata(username);
    }
  }
  public getUserdata(Username: string): any {
    this._http.get("/user/me/" + Username).subscribe((response: any) => {
      let data: any = {};
      data.full_name = response.data.FullName;
      data.image = response.data.Image;
      data.id = response.data.Id;
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.userData.next(data);
    });
  }

  public clearUserData(): any {
    this.userData = new BehaviorSubject(null);
  }

}
