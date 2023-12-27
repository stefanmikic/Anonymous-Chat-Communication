import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { CryptoService } from '../../services/crypto.service';
import { ActivatedRoute } from '@angular/router'
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  loggedInUsers: string[] = [];
  selectedUser: string = '';
  newMessage: string = '';
  messages: Array<string> | null = new Array<string>();
  currentUser: string = '';

  constructor(private messageService: MessageService, private authService: AuthService,
    private cryptoService: CryptoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedUser = "marko";
    this.fetchLoggedInUsers();
    this.route.queryParamMap.subscribe(params => {
      this.currentUser = params.get('username');
    })
    this.messageService.formMessage(this.currentUser).subscribe({
      next: ((data: Array<string> | null) => {
        this.messages = data;
      }),
      error: (err: any) => {
        console.log("Error fetching messages for user", err);
      }

    });
  }

  fetchLoggedInUsers(): void {
    this.authService.getLoggedInUsers().subscribe({
      next: (data: string[]) => {
        console.log('Test: ', data)
        this.loggedInUsers = data;
      },
      error: (error: any) => {
        console.error('Error fetching logged in users', error);
      }
    });
  }

  sendMessage(messageData: string): void {
    if (this.selectedUser && this.newMessage) {
      let sender: string = '';
      const currentDate = new Date();

      this.route.queryParams.subscribe(params => {
        sender = params['username'];
      })
      this.messageService.processMessage(messageData, sender, this.selectedUser, currentDate.toString())
    } else {
      alert('Receiver must be selected.');
    }
  }

  fetchMessages(): void {
    this.messageService.drainMessages().subscribe(
      (data: string) => {
        console.log("PORUKE: ", data);

        // this.messages = this.messageService.formMessage("marko");
      },
      (error: any) => {
        console.error('Error fetching messages for users', error);
      }
    );
  }

}
