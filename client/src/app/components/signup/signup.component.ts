import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RegistrationService } from "../../services/registration.service";

@Component({
  selector: 'client-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public regestrationService: RegistrationService, public router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  public save(value: any) {
    if (this.signupForm.valid) {
      this.regestrationService.addUser(value).then((data: any) => {
        if (data != null) {          
          this.router.navigate(['/']);
        }
      });
    }
  }
}
