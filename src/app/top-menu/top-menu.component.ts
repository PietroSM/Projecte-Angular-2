import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'top-menu',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './top-menu.component.html',
    styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {

    #authService = inject(AuthService);

    isLogged = computed(() => this.#authService.getLogged()());


    logout(){
        this.#authService.logout();
    }
}
