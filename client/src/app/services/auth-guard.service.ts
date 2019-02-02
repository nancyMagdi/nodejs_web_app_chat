import { Injectable } from '@angular/core';
import { UserService } from "../services/user.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor( public userService: UserService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.userService.logout();
    }
    return true;
  }
}
