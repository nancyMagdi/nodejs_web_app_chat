import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'client-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

/*
1)display the list of contact 
          contact list chat 
            - online or not 
            - Mesasge (if exist)
          contact List :
            - online or not 
          search contact list :
            - display add to contact list button
  2) at user click event to open chat emit an event and send the user id to the parent container to open it's chat
  3) display message alert in case the user recieve a new message from him
*/
export class ContactListComponent implements OnInit {
  @Input() contactsListObject: any[];
  @Output() openContactChat = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit() {
  }

  public openChatHistory(contactId:number){
    this.openContactChat.emit(contactId);
    // TODO add the active class to the clicked element 
  }

}
