import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MessagesService } from "../../services/messages.service";
import { SocketService } from '../../services/socket.service';
import { from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
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
  private threadId = 0;
  private curerntUserObject: any;
  public selectedFile: File;
  @Input() userInfo: any;
  @ViewChild('fileInput') fileInput:ElementRef;
  @Input() set newMessage(message: any[]) {
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
          this.threadId = this.chatHistory[0].ChatThreadId;
          //this.chatHistory.unshift(data.reverse());
          this.Loading = false;
          // scroll to the button 
        }
      });
    }
  }

  constructor(private messageService: MessagesService, private socketService: SocketService, private userDataService: UserService, private cd: ChangeDetectorRef) { }

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
    // check if there is a file to be uploaded 
    // if a file exist upload it first then at responce emit the message and add the file name in it else emit the message 
    if (this.selectedFile) {
      // call the upload service
      const formdata: FormData = new FormData();
      const fileName:string = this.selectedFile.name;
      formdata.append('selectedFile', this.selectedFile);
      formdata.append('threadId' , this.threadId.toString());

      this.messageService.pushFileToStorage(formdata).then((data: any) => {
        if (data.Success == true) {
          console.log('File is completely uploaded!');
          var params = {
            "fromUserId": this.curerntUserObject.id,
            "toUserId": this.userInfo.Id,
            "AttachementLocation": fileName
          };
          this.emitMessageToSocket(params, value.message);
        }
      });
      this.selectedFile = undefined;
    } else {
      // regular message
      var params = {
        "fromUserId": this.curerntUserObject.id,
        "toUserId": this.userInfo.Id,
        "AttachementLocation": null
      };
      this.emitMessageToSocket(params, value.message);
    }
  }
  public setDate(dateString: string) {     // Setter Function
    return new Date(dateString)
  }

  private emitMessageToSocket(params, messageToDisplay) {
    let newMessage = {
      CreationDateTime: new Date(),
      FromUserId: this.curerntUserObject.id,
      MessageText: messageToDisplay,
      ToUserId: this.userInfo.Id,
      AttachementLocation: params.AttachementLocation
    }
    this.socketService.socketEmit("Message-sent", newMessage);
    this.sendMessageForm.reset();
    
    this.chatHistory.push(newMessage);
    this.cd.detectChanges();
  }

  public selectFile(event:any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files.item(0);
    }
  }
  public downloadFile(fileName: string) {
    this.Loading = true;
    this.messageService.downloadFile(fileName, this.threadId).then((data: any) => {
      this.Loading = false;
    });
  }

  public pressToUploadFile(){
    this.fileInput.nativeElement.click();
  }
}
