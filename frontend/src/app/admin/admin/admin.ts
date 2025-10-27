import { Component, effect, inject } from '@angular/core';
import { UserService } from '../../users/user-service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  private readonly userService = inject(UserService);
  readonly users = this.userService.users;

  // Charge la liste à l’arrivée sur la page
  constructor() {
    effect(() => this.userService.loadAll());
  }
}