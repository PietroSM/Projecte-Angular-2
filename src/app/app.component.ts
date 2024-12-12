import { Component } from '@angular/core';
import { TopMenuComponent } from "./top-menu/top-menu.component";

@Component({
    selector: 'app-root',
    imports: [TopMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-svtickets';





}
