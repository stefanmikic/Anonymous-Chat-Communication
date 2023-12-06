import { Component } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private messageService: MessageService) { }
  loggedInUsers: string[] = ['User 1', 'User 2', 'User 3'];
  selectedUser: string = '';
  newMessage: string = '';

  sendMessage(): void {
    const messageData = {
      text: 'Hello, how are you?',
    };

    this.messageService.sendMessage(messageData)
      .subscribe(
        response => {
          console.log('Message sent successfully!', response);
        },
        error => {
          console.error('Failed to send message:', error);
        }
      );
  }

}
