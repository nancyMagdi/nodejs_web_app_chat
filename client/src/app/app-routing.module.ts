import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { SharedModule } from './shared/shared.module';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {path:"chat" , component:MainContainerComponent , canActivate: [AuthGuard]}
];
//, canActivate: [AuthGuard] 
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule, SharedModule]
})
export class AppRoutingModule { }
