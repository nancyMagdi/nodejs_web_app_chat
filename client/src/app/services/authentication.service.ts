import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
//import { HttpClient, HttpHeaderResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from "../services/user.service";
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

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.isLoggedIn = new BehaviorSubject(false);
		this.userToken = new BehaviorSubject<string>(localStorage.getItem("token"));
		this.loginError = new BehaviorSubject(null);

    this.userTokenHandler();
  }
  //Login 
  public login(userInput: any) {
    this.http.post('/auth/signin', userInput).subscribe((response: any) => {
      if (response.status === 1) {
        this.userToken.next(response.data);
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
        if (token != localStorage.getItem('token') && this.userService) {
          localStorage.setItem('token', token);
          //   this.userDataService.getMydata();
        }
        this.isLoggedIn.next(true)
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.isLoggedIn.next(false);
        this.router.navigate(['/']);
      }
    });
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

}
