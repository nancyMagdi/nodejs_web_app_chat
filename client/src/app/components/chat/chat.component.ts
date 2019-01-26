import { Component, OnInit, Input } from '@angular/core';
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'client-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public chatHistory : any[] =[];
  public Loading: boolean = false;
  private limit= 10 ;
  private offset = 0;
  @Input() userInfo :any;
  @Input() set inputUserId(value : number){
    this.chatHistory = [];
    //  call the service to get the user history 
    this.messageService.getChatHistory(value,this.limit,this.offset).then((data: any) => {
      if (data != null) {
        this.chatHistory = data.reverse();
        //this.chatHistory.unshift(data.reverse());
        console.log(this.chatHistory);
        this.Loading = false;
        // scroll to the button 
      }
    });
  }

  constructor( private messageService : MessagesService) { }

  ngOnInit() { }
//Todo add a handler for scrolling to the top

}
