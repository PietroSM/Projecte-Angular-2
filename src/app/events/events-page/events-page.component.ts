import { Component, signal, inject, computed } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { EventsService } from "../../services/events.service";
import { MyEvent } from "../../interfaces/my-event";
import { EventCardComponent } from "../event-card/event-card.component";


@Component({
    selector: 'events-page',
    imports: [FormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})
export class EventsPageComponent {

  events =  signal<MyEvent[]>([]);//Declarem com signal la array
  search = signal('');

  #eventsService = inject(EventsService);

  constructor(){
    this.#eventsService.getEvents()
    .pipe(takeUntilDestroyed())
    .subscribe({
      next: (events) => this.events.set(events),
      error: (error) => console.log(error)
    });  
  }


  filteredTitleDescrip = computed(() => {
    const searchLower = this.search().toLocaleLowerCase();

    return searchLower ? this.events().filter((event) => 
      event.title.toLocaleLowerCase().includes(searchLower) ||
      event.description.toLocaleLowerCase().includes(searchLower)
    ) : this.events();
  });



  orderDate(){
    const aux = this.events()
      .toSorted((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
      this.events.update(() => [...aux]);
  }

  orderPrice(){
    const aux = this.events()
    .toSorted((a, b) => a.price - b.price);
    this.events.update(() => [...aux]);
  }


  addEvent(event: MyEvent) {
    //Afegim el nou event a l'array i canviem la referencia
    this.events.update(events => [...events, event]);
  }


  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((p) => p !== event))
  }



}
