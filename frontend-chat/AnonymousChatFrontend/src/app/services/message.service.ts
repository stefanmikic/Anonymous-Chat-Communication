import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:8443/send';
  constructor(private http: HttpClient) { }

  sendMessage(messageData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, messageData);
  }

  selectRandomValue(): number {
    const startValue: number = 3;
    const endValue: number = 11;
    return Math.floor(Math.random() * (endValue - startValue)) + startValue;
  }

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

  processMessage(message: string): void {
    

  }
  

}
