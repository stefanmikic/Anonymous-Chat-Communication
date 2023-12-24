import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoService } from './crypto.service';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:8443/save-message';
  constructor(private http: HttpClient, private cryptoService: CryptoService) { 
  }

  //sending message to backend server  
  sendMessage(messageData: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, messageData);
  }

  //select random integer between startValue and endValue
  selectRandomValue(): number {
    const startValue: number = 3;
    const endValue: number = 11;
    return Math.floor(Math.random() * (endValue - startValue)) + startValue;
  }

  //split message into equal number of parts
  splitMessage(message: string, numOfParts: number): string[] {
    const parts: string[] = new Array(numOfParts);
    const partLength: number = Math.ceil(message.length / numOfParts);
    let startIndex: number = 0;

    for (let i = 0; i < numOfParts; i++) {
      const endIndex: number = Math.min(startIndex + partLength, message.length);
      parts[i] = message.substring(startIndex, endIndex);
      startIndex = endIndex;
    }

    return parts;
  }
//forming message which will be sent on backend
 async processMessage(message: string, sender: string, reciever: string,  date: string): Promise<Observable<string>>{
    const keys = await this.cryptoService.generateKeyPair();
    const privateKey = keys.privateKey;
    const publicKey = keys.publicKey;

   

   const splittedMessage = this.splitMessage(message, this.selectRandomValue());
   let i = 1;
    splittedMessage.forEach(async part => {
    let encryptData =await this.cryptoService.encryptData(part, publicKey);
    let decryptData = await this.cryptoService.decryptData(encryptData, privateKey);
   this.sendMessage(i++ + "||" + decryptData + "||" + sender + "||" + reciever + "||" + date + "||" + privateKey + "\n").subscribe(
      (response) => {
        console.log('Response from the server:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
   )});
   return new Observable<string>;
   


   

  }
  

}
