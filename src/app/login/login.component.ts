import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;

  showError: boolean = false;

  form!: any;

  constructor(private loginService: LoginService,
    private authService: AuthService) { }

  ngOnInit(): void {
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach((form) => {
      this.form = form;
      form.addEventListener('submit', (event:any) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  login () {
    if (this.form.checkValidity()) {
      this.loginService.login(this.username, this.password).subscribe((resp) => {
          console.log(resp);
          this.authService.login();
          
      }, (error) => {
        this.showError = true;
        console.error(error);
        setTimeout(() => {
          this.showError = false;
        }, 4000)
      })
    }
    
  }

}
