import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MessagesService } from "../../services/messages.service";
import { SocketService } from '../../services/socket.service';
import { from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'client-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public chatHistory: any[] = [];
  public Loading: boolean = false;
  private limit = 10;
  public sendMessageForm: FormGroup;
  private offset = 0;
  private curerntUserObject: any;
  @Input() userInfo: any;
  @Input() set newMessage(message:any[]){
    this.chatHistory.push(message);
    this.cd.detectChanges();
  }
  @Input() set inputUserId(value: number) {
    if (value && value != 0) {
      this.chatHistory = [];
      this.sendMessageForm.reset();
      //  call the service to get the user history 
      this.messageService.getChatHistory(value, this.limit, this.offset).then((data: any) => {
        if (data != null) {
          this.chatHistory = data.reverse();
          //this.chatHistory.unshift(data.reverse());
          this.Loading = false;
          // scroll to the button 
        }
      });
    }
  }

  constructor(private messageService: MessagesService, private socketService: SocketService,private userDataService: UserService,private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.userDataService.userData.subscribe((data) => {
      if (data != null) {
        this.sendMessageForm = new FormGroup({
          'message': new FormControl('', [Validators.required]),
        });
        let currentUser = localStorage.getItem("currentUser")
        if (currentUser) {
          this.curerntUserObject = JSON.parse(currentUser);
        }
      }
    })

  }
  //Todo add a handler for scrolling to the top

  // sending message
  public sendMessage(value: any) {
    var params = {
      "messageText": value,
      "fromUserId": this.curerntUserObject.id,
      "toUserId": this.userInfo.Id,
    };
    this.socketService.socketEmit("Message-sent", params);
    this.sendMessageForm.reset();
    let newMessage = {
      CreationDateTime: new Date(),
      FromUserId: this.curerntUserObject.id,
      MessageText: value.message,
      ToUserId: this.userInfo.Id
    }
    this.chatHistory.push(newMessage);
    this.cd.detectChanges();
  }

  public setDate(dateString: string) {     // Setter Function
    return new Date(dateString)
  }
}
