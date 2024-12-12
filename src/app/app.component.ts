import { Component } from '@angular/core';
import { EventsPageComponent } from './events/events-page/events-page.component';
import { TopMenuComponent } from "./top-menu/top-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EventsPageComponent, TopMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-svtickets';





}
