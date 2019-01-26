import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../../services/socket.service'
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
          search contact list : (ToDo)
            - display add to contact list button
  2) at user click event to open chat emit an event and send the user id to the parent container to open it's chat
  3) display message alert in case the user recieve a new message from him (ToDo)
*/
export class ContactListComponent implements OnInit {
  @Input() contactsListObject: any[];
  // 1 for contact chat history , 2 for contact list, 3 for search result
  @Input() typeOfList: number;
  @Output() openContactChat = new EventEmitter<number>();
  private activeUser :number;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.socketOn("user-logged-in", (response) => {
      var index = this.contactsListObject.findIndex(element => element.Id === response.loggedInUserId)
      this.contactsListObject[index].Status = 1;
      this.contactsListObject[index].SocketId = response.loggedinUserSoketId;
      console.log(response);
    });
  }

  public openChatHistory(contactId: number) {
    this.openContactChat.emit(contactId);
    //  add the active class to the clicked element
    this.activeUser = contactId;   
  }



}
