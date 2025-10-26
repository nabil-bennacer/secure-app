import { Component, effect, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthServices } from '../auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports : [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  readonly auth = inject(AuthServices);
  readonly router = inject(Router);
  readonly form = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
    });
  }

  onSubmit() {
    const login = this.form.value.login;
    const password = this.form.value.password;
    if (login && password) {
      this.auth.login(login, password);
    }
  }
}
