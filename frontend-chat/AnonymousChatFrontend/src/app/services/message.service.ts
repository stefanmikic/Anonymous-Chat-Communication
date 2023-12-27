import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { CryptoService } from './crypto.service';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:8443/save-message';
  private apiUrlGetMessages = 'https://localhost:8443/all-messages';
  private apiUrlGetMessagesForUser = 'https://localhost:8443/user-messages?username=';
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
    if (message.length < numOfParts) {
      console.error('Error: Message length is smaller than numOfParts');
      return [];
    }

    const minCharsPerPart = Math.floor(message.length / numOfParts);
    let extraChars = message.length % numOfParts;

    const parts: string[] = [];
    let startIndex = 0;

    for (let i = 0; i < numOfParts; i++) {
      let partLength = minCharsPerPart;
      if (extraChars > 0) {
        partLength++;
        extraChars--;
      }

      const endIndex = startIndex + partLength;
      let part = message.substring(startIndex, endIndex);
      parts.push(part);
      startIndex = endIndex;
    }

    return parts;
  }

  //forming message which will be sent on backend
  async processMessage(message: string, sender: string, reciever: string, date: string): Promise<void> {
    //instantiate keys for message that is going to be sent  
    const keys = await this.cryptoService.generateKeyPair();
    const privateKey = keys.privateKey;
    const publicKey = keys.publicKey;

    //create an id for each message
    const id = uuidv4();

    //split message into random number of parts
    let partsNumber = this.selectRandomValue();
    if (partsNumber > message.length) {
      partsNumber = message.length;
    }
    const splittedMessage = this.splitMessage(message, partsNumber);
    let i = 1;
    splittedMessage.forEach(async part => {
      //encrypt message with public key 
      let encryptData = await this.cryptoService.encryptData(part, publicKey);
      //for each part send it's ordinal number, and public key
      let msg = i++ + "p@rt" + id + "p@rt" + encryptData + "p@rt" + sender + "p@rt" + reciever +
        "p@rt" + date + "p@rt" + privateKey + "@@";
      this.sendMessage(msg).subscribe({
        next: (response) => {
          console.log('Response from the server:', response);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    });
  }

  getUserMessages(reciever: string): Observable<Array<string>> {
    const url = this.apiUrlGetMessagesForUser + reciever;
    return this.http.get<Array<string>>(url);
  }

  //form messages
  formMessage(receiver: string): Observable<Array<string> | null> {
    return this.getUserMessages(receiver).pipe(
      map((data: Array<string>) => {
        let messages: Array<string> = [];
        data.forEach(async (part: string) => {
          if (part) {
            messages.push(await this.decryptMessage(part));
          }
        });
        return this.composeMessage(data);
      }),
      catchError((error: any) => {
        console.error("An error occurred when trying to fetch messages for the user: ", error);
        return of(null); // Returning Observable of null in case of an error
      })
    );
  }

  //checks if the reciever is the one who is message for
  checkMessageReciever(message: string, reciever: string): boolean {
    const parts: string[] = message.split("p@rt");
    if (parts[4] === reciever) {
      return true;
    }
    else {
      return false;
    }
  }

  drainMessages(): Observable<string> {
    return this.http.get<string>(this.apiUrlGetMessages);
  }

  composeMessage(parts: string[]): string[] {
    let messages: string[];
    let sender: string;
    let differentMessages = new Map<string, string[]>();
    let uuidsSet: Set<string> = new Set<string>();
    parts.forEach(part => {
      const uuid = this.getUUIDFromMessage(part);
      if (uuid) {
        uuidsSet.add(uuid);
      }
    });
    uuidsSet.forEach(uuid => {
      let uuidMessages = parts.filter(part => this.getUUIDFromMessage(part) === uuid);
      differentMessages.set(uuid, uuidMessages);
    });
    //sorting message parts for a message
    Array.from(differentMessages.keys()).forEach(key => {
      differentMessages.set(key, this.sortMessagesByid(differentMessages.get(key)));
    })

    let msg: string;
    //forming message from sorted parts
    return this.formMessageFromHashMap(differentMessages);
  }

  formMessageFromHashMap(map: Map<string, string[]>): string[] {
    let messages: Array<string> = new Array<string>();
    Array.from(map.keys()).forEach(async key => {
      let messageParts: string[] = map.get(key);
      let fullMessage: string = await this.buildAndDecryptMessages(messageParts);
      messages.push(this.getSenderFromMessage(messageParts[0]) + ': ' + fullMessage + ' - ' + this.getDateFromMessage(messageParts[0]).slice(0, 25));
    });
    return messages;
  }


  getUUIDFromMessage(msg: string): string {
    let parts: string[] = msg.split('p@rt');
    return parts[1];
  }

  sortMessagesByid(messages: string[]): string[] {
    return messages.sort((a, b) => Number(a.split('p@rt')[0]) - Number(b.split('p@rt')[0]));
  }

  getSenderFromMessage(msg: string): string {
    let parts: string[] = msg.split('p@rt');
    return parts[3];
  }

  getDateFromMessage(msg: string): string {
    let parts: string[] = msg.split('p@rt');
    return parts[5];
  }

  async decryptMessage(msg: string): Promise<string> {
    return this.cryptoService.decryptData(msg.split("p@rt")[2], msg.split("p@rt")[6])
  }

  async buildAndDecryptMessages(messages: string[]): Promise<string> {
    let fullMessage: string;
    let decryptedMessages: string[] = await Promise.all(
      messages.map(async msg => {
        return await this.decryptMessage(msg);
      })
    );
    return decryptedMessages.join('');
  }



}
