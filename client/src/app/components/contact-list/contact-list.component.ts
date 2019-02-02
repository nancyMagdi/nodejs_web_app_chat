import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
import { ContactListService } from '../../services/contact-list.service';
import { SnotifyService } from 'ng-snotify';

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

  private activeUser: number;

  constructor(private socketService: SocketService, private cd: ChangeDetectorRef,
    private userDataService: UserService, private contactListservice: ContactListService,
    private notificationService: SnotifyService) { }

  ngOnInit() {
    this.userDataService.userData.subscribe((data) => {
      if (data != null) {
        this.listenToLogin();
      }
    });
  }

  public listenToLogin() {
    this.socketService.socketOn("user-logged-in").subscribe((response) => {
      if (this.contactsListObject && this.contactsListObject.length > 0) {
        var index = this.contactsListObject.findIndex(element => element.Id == response.loggedinUserId)
        console.log("Index at login" + index);
        if (index >= 0) {
          this.contactsListObject[index].Status = 1;
          this.contactsListObject[index].SocketId = response.loggedinUserSoketId;
          this.cd.detectChanges();
        }
      }
    });

    this.socketService.socketOn("logout").subscribe((response) => {
      if (this.contactsListObject.length > 0) {
        var index = this.contactsListObject.findIndex(element => element.Id == response.loggedinUserId);
        console.log("Index at login" + index);
        if (index >= 0) {
          this.contactsListObject[index].Status = 0;
          this.contactsListObject[index].SocketId = null;
          this.cd.detectChanges();
        }

      }
    });
  }


  public openChatHistory(contactId: number) {
    var index = this.contactsListObject.findIndex(element => element.Id === contactId);
    if (this.typeOfList === 3) {
      if (index >= 0) {
        if (this.contactsListObject[index].isConnected !== 1) {
          this.notificationService.error('Sorry you must add user first to be able to send messages', {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            position: "rightTop"
          });
        }
        return ;
      }
    }
    this.openContactChat.emit(contactId);
    //  add the active class to the clicked element
    this.activeUser = contactId;
    if (index >= 0) {
      this.contactsListObject[index].message.unreadCount = 0;
      this.cd.detectChanges();
    }
  }

  public setDate(dateString: string) {
    return new Date(dateString)
  }

  public addContact(newContact: number) {
    this.contactListservice.addContact(newContact).then((data: any) => {
      if (data != null) {
        console.log(data);
        var index = this.contactsListObject.findIndex(element => element.Id == newContact)
        console.log("Index at login" + index);
        if (index >= 0) {
          this.contactsListObject[index].isConnected = null;
        }
      }
    });
  }

}
