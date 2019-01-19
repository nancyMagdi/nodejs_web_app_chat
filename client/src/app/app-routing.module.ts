import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: "", component: LoginComponent },
 { path: "signup", component:SignupComponent  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule,SharedModule]
})
export class AppRoutingModule { }
