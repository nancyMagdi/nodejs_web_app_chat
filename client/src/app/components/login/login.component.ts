import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from '@angular/router';

@Component({
  selector: 'client-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public displayErrorMessage: boolean = false;

  constructor(public formBuilder: FormBuilder, public auth: AuthenticationService, public router: Router) { 
    this.displayLoginError();
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })
  }

  public login(value) {
    if (this.loginForm.valid) {
      this.auth.login(value);
    }
  }

  public displayLoginError() {
    this.auth.loginError.subscribe(loginError => {
      if (loginError) {
        this.displayErrorMessage = true;
      }
    })

  }
}
