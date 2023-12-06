import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor() { }

  login() {
    if (this.username === 'test') {
      // Authentication successful
      
    } else {
      // Authentication failed
      console.log('Login failed. Invalid username or password.');
    }
  }
}
