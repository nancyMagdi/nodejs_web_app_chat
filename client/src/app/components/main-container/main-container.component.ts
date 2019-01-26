import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ContactListService } from '../../services/contact-list.service';

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
  public userInfo :any;
  
  constructor(private contactListservice: ContactListService) {
    this.sideMenuItems = listViewEnum;
  }

  ngOnInit() {
    this.changeView(listViewEnum.displayChatList);
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
}
