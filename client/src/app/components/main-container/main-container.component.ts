import { Component, OnInit, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ContactListService } from '../../services/contact-list.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketService } from '../../services/socket.service';
import {UserService} from "../../services/user.service";
export enum listViewEnum {
  displayChatList = 1,
  displayContactList = 2,
  displaySearachList = 3
};

@Component({
  selector: 'client-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})

export class MainContainerComponent implements OnInit {
  public sideMenuActiveItem: any;
  public sideMenuItems: any;
  public otherUserId: number = 0;
  public contactsListObject: any[];
  public loading: boolean = false;
  public displaySearchField: boolean = false;
  public displayedListType: number;
  public userInfo: any;
  public curerntUserObject:any ;
  public newChatMessage:any;
  constructor(private contactListservice: ContactListService, private router: Router,
    private authService: AuthenticationService, private socketService: SocketService ,
    private userDataService: UserService, private cd: ChangeDetectorRef) {
    this.sideMenuItems = listViewEnum;   
  }

  ngOnInit() {
    this.userDataService.userData.subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.curerntUserObject = data;
        this.changeView(listViewEnum.displayChatList);
        this.listenToNewMessage();
      }
    })
  }

  /*
    listener to the child component of the contact list to set the chat user id
  */
  public openContactChat(contactId: number) {
    // filter the user info 
    let index = this.contactsListObject.findIndex(element => element.Id === contactId);
    this.userInfo = this.contactsListObject[index];
    this.otherUserId = contactId;
  }

  public changeView(viewToDisplay: listViewEnum) {
    this.loading = true;
    this.contactsListObject = null;
    this.displayedListType = viewToDisplay;
    switch (viewToDisplay) {
      case listViewEnum.displayChatList:
        this.displaySearchField = false;
        this.contactsListObject = null;
        // call the service of chat contact and get the data from service 
        this.contactListservice.getContactListOfChatHistory().then((data: any) => {
          if (data != null) {
            console.log(data);
            this.contactsListObject = data;
            this.loading = false;
          }
        });
        break;

      case listViewEnum.displayContactList:
        this.displaySearchField = false;
        // call the service to get the contact and get the data from the service
        this.contactListservice.getContactList().then((data: any) => {
          if (data != null) {
            this.contactsListObject = data;
            this.loading = false;
          }
        });
        break;

      case listViewEnum.displaySearachList:
        // display the search field
        this.displaySearchField = true;
        this.loading = false;
        break;
    }
  }

  public logout() {
    this.socketService.socketEmit("logout", { id: this.curerntUserObject.id });
    this.authService.logout();
  }

  public listenToNewMessage() {
    this.socketService.socketOn('message-received', (response) => {
      console.log(response);
      if (response && response.FromUserId !== this.otherUserId) {
        // set the contact list notification if the user chat is not openned
        var index = this.contactsListObject.findIndex(element => element.Id === response.FromUserId);
        if (index >= 0) {
          this.contactsListObject[index].message.unreadCount += 1;
          this.contactsListObject[index].message.message = response.MessageText;
          this.contactsListObject[index].message.date = response.CreationDateTime;
        }
        this.cd.detectChanges();
      }else if(response && response.FromUserId === this.otherUserId){
        // push the message to the chat component
        this.newChatMessage = response;
        this.cd.detectChanges();
      }
    });
  }
}
