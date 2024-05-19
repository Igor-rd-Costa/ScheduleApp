import { Component } from '@angular/core';
import AuthService from 'src/app/Services/AuthService';
import { AuthenticatedLayout } from '../AuthenticatedLayout/AuthenticatedLayout.component';
import { AnonymousLayout } from '../AnonymousLayout/AnonymousLayout.component';

@Component({
  selector: 'Layout',
  standalone: true,
  imports: [AuthenticatedLayout, AnonymousLayout],
  templateUrl: './Layout.component.html',
})
export class Layout {

  public constructor(protected authService : AuthService) {}
}
