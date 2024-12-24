import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { MyEvent } from '../../shared/directives/my-event';
import { DatePipe, NgClass } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { EventsService } from '../../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'event-card',
  imports: [DatePipe, IntlCurrencyPipe, RouterLink, NgClass],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();
  title = "";

  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);


  eliminar() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.deleted.emit());
  }

  canviarAttend(){

    if(this.event().attend){
      this.#eventsService.deleteAttend(this.event().id)
        .subscribe({
          error: (error) => console.log(error)
        });
      
        this.event().attend = false;
        this.event().numAttend = this.event().numAttend - 1;

    }else if(!this.event().attend){


      this.#eventsService.postAttend(this.event().id)
        .subscribe({
          error: (error) => console.log(error)
        });
      
        this.event().attend = true;
        this.event().numAttend = this.event().numAttend + 1;

    }
  }

}
