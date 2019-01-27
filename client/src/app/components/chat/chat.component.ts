import { Component, OnInit, Input } from '@angular/core';
import { MessagesService } from "../../services/messages.service";
import { SocketService } from '../../services/socket.service';
import { from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  @Input() set inputUserId(value: number) {
    this.chatHistory = [];
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

  constructor(private messageService: MessagesService, private socketService: SocketService) { }

  ngOnInit() {
    this.sendMessageForm = new FormGroup({
      'message': new FormControl('', [Validators.required]),
    });
    let currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      this.curerntUserObject = JSON.parse(currentUser);
    }
    this.socketService.socketOn('message-received', (response) => {
      console.log(response);
      if (response && response.fromUserId ==  this.userInfo.Id) {
        this.chatHistory.push(response);
       // appService.scrollToBottom();
      }
    });
  }
  //Todo add a handler for scrolling to the top

  // sending message
  public sendMessage(value: any) {
    var params = {
      "messageText": value,
      "fromUserId": this.curerntUserObject.id,
      "toUserId": this.userInfo.Id,      
    };
    console.log(params);
    this.socketService.socketEmit("Message-sent", params);
    params["CreationDateTime"] = new Date();
    this.chatHistory.push(params);
  }
}
