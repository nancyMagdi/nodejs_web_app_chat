import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
//import { HttpClient, HttpHeaderResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

export interface ApiResponse {
  status: number
  data: string
  errors: any[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userToken: BehaviorSubject<string>;
  public isLoggedIn: BehaviorSubject<Boolean>;
  public loginError: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedIn = new BehaviorSubject(false);
    this.userToken = new BehaviorSubject<string>(localStorage.getItem("token"));
    this.loginError = new BehaviorSubject(null);

    this.userTokenHandler();
  }
  //Login 
  public login(userInput: any) {
    console.log(userInput);
    localStorage.setItem('username', userInput.username);
    this.http.post('/auth/signin', userInput).subscribe((response: any) => {
      if (response.Success) {        
        this.userToken.next(response.accessToken);
        //TODO  start the socket service 
        this.router.navigate(['/chat'])
      }
    }, (error: any) => {
      this.userToken.next(null);
      this.loginError.next(error)
    });
    return this.isLoggedIn;
  }

  private userTokenHandler() {
    /**
   * Add to local storage
   */
    this.userToken.subscribe(token => {

      if (token != null) {
          localStorage.setItem('token', token);
        
        this.isLoggedIn.next(true)
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('username');
        this.isLoggedIn.next(false);
        this.router.navigate(['/']);
      }
    });
  }

}
