import { Component, inject } from '@angular/core';
import { AuthServices } from '../shared/auth/auth-services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports : [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  readonly auth = inject(AuthServices);
  readonly router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}