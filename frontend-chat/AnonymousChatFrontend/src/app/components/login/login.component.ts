import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.username, this.password)
      .subscribe(
        response => {
          if(response === true){
            console.log("Login successful");
            this.router.navigate(['/home'], { queryParams: { username: this.username } });
          }
          else{
            console.log("Wrong username or password");
          }
        },
        error => {
          // Handle error responses
          console.error('Login failed', error);
          // Display error message to user or perform necessary actions
        }
      );
  }
}
