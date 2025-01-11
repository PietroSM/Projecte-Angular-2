import { Component, signal, inject, computed, Signal, effect } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventsService } from "../../services/events.service";
import { MyEvent } from "../../interfaces/my-event";
import { EventCardComponent } from "../event-card/event-card.component";
import { debounce, debounceTime, distinctUntilChanged } from "rxjs";


@Component({
    selector: 'events-page',
    imports: [FormsModule, EventCardComponent, ReactiveFormsModule],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})
export class EventsPageComponent {

  events =  signal<MyEvent[]>([]);//Declarem com signal la array

  #eventsService = inject(EventsService);
  contador = 2;
  hiddenLoadMore = true;
  filtre = signal("");


  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
    ),
    {initialValue: ''}
  );

  constructor(){

    effect(() => {
      this.geteventsfiltre();
    });
  }

  orderDate(){
    this.filtre.set("date")
    this.geteventsfiltre();
  }

  orderPrice(){
    this.filtre.set("price");
    this.geteventsfiltre();
  }

  orderDistancie(){
    this.filtre.set("distance");
    this.geteventsfiltre();
  }


  geteventsfiltre(){
    this.#eventsService.getEvents(1,this.filtre(),this.search()!)
    .subscribe({
      next: (events) => {
        this.events.set(events.events);
        this.contador = 2;
        this.hiddenLoadMore = events.more;
      },
      error: (error) => console.log(error)
    });
  }


  addEvent(event: MyEvent) {
    //Afegim el nou event a l'array i canviem la referencia
    this.events.update(events => [...events, event]);
  }


  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((p) => p !== event))
  }

  loadMore(){
    this.#eventsService.getEvents(this.contador,this.filtre(),this.search()!)
    .subscribe({
      next: (events) => {
        this.events.set(this.events().concat(events.events));
        this.contador ++;
        this.hiddenLoadMore = events.more;
      },
      error: (error) => console.log(error)
    });
  }




}
