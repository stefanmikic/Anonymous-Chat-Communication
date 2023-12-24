import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { randomUUID } from 'node:crypto';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:8443/save-message';
  constructor(private http: HttpClient) { 
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

  processMessage(message: string, sender: string, reciever: string, key: string): Observable<string>{
   const splittedMessage = this.splitMessage(message, this.selectRandomValue());
   splittedMessage.forEach(part => {
   this.sendMessage(part + " sender:" + sender + " reciever: " + reciever + " key: " + key + "\n").subscribe(
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
