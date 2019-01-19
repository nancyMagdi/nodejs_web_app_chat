import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {  HttpClientModule, HTTP_INTERCEPTORS,} from '@angular/common/http';
import {HttpInterceptorHelper} from "./helpers/http-interceptor";
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChatComponent } from './components/chat/chat.component';
import { SharedModule } from './shared/shared.module';
import { MainContainerComponent } from './components/main-container/main-container.component' ;
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


const tokenInterceptorOptions = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorHelper,
  multi: true
}

@NgModule({  
  declarations: [
    AppComponent,
    HeaderBarComponent,
    ContactListComponent,
    LoginComponent,
    SignupComponent,
    ChatComponent,
    MainContainerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],  
  providers: [
    tokenInterceptorOptions,
  //  AuthGuardService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule { }
