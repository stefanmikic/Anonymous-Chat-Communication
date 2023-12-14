import { Component } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { CryptoService } from '../../services/crypto.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})

export class MessageComponent {
  privateKey:string = '';
  publicKey:string = '';
  partNum: number = 0;
  message: string = '';
  parts: string[] = [];
  uuid: string = '';
  date: string = '';
  reciever: string = '';
  sender: string = '';

  constructor(private http: HttpClient,private cryptoService: CryptoService,
     private messageService: MessageService){}

  onSend(){
    //Instantiate keys
    this.generateKeyPair();
    

  }
  
  generateKeyPair(){
    this.cryptoService.generateKeyPair()
    .then(keys => {
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
    }).catch(error => {
      console.error('Error generating keys', error);
    })
  }





}
