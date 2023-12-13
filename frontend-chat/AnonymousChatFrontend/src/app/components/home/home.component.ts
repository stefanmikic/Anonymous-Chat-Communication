import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private messageService: MessageService, private authService: AuthService) { }
  loggedInUsers: string[] = [];
  selectedUser: string = '';
  newMessage: string = '';

  ngOnInit(): void {
    this.fetchLoggedInUsers();
  }

 fetchLoggedInUsers(): void {
    this.authService.getLoggedInUsers().subscribe(
      (data: string[]) => {
        this.loggedInUsers = data;
      },
      (error: any) => {
        console.error('Error fetching logged in users', error);
      }
    );
  }
  sendMessage(): void {
    const messageData =  'Hello, how are you?';

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
