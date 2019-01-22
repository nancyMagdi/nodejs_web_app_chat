import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'client-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() otherUserId: number;
  public Loading: boolean = false;
  constructor() { }

  ngOnInit() {
    // TODO call the service to get the user history 
  }

}
