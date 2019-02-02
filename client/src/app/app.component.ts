import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title }     from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'client-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'client';
}
