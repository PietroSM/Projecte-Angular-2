import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { EventCardComponent } from "../event-card/event-card.component";
import { Title } from '@angular/platform-browser';
import { MyEvent } from '../../interfaces/my-event';


@Component({
    selector: 'event-detail',
    imports: [EventCardComponent],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {

  #router = inject(Router);
  #title = inject(Title);
  event = input.required<MyEvent>();


  constructor() {
    effect(() => {
      if(this.event()){
        this.#title.setTitle(this.event()?.description + ' | Angular Events');
      }
    });
  }

  deleteEvent(){
    this.#router.navigate(['/events']);
  }


  goBack() {
    this.#router.navigate(['/events']);
  }

}
