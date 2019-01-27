import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
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
  constructor(private contactListservice: ContactListService, private router: Router,
    private authService: AuthenticationService, private socketService: SocketService ,private userDataService: UserService) {
    this.sideMenuItems = listViewEnum;   
  }

  ngOnInit() {
    this.changeView(listViewEnum.displayChatList);
    this.userDataService.userData.subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.curerntUserObject = data;
      }
    })
  }

  /*
    listener to the child component of the contact list to set the chat user id
  */
  public openContactChat(contactId: number) {
    console.log(contactId);
    // filter the user info 
    let index = this.contactsListObject.findIndex(element => element.Id === contactId);
    this.userInfo = this.contactsListObject[index];
    console.log(this.userInfo);
    this.otherUserId = contactId;
  }

  public changeView(viewToDisplay: listViewEnum) {
    console.log(viewToDisplay);
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
}
