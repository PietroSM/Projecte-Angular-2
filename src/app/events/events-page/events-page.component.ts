import { Component, signal, inject, computed, Signal, effect, input } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventsService } from "../../services/events.service";
import { MyEvent } from "../../interfaces/my-event";
import { EventCardComponent } from "../event-card/event-card.component";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { UsersService } from "../../services/users.service";


@Component({
    selector: 'events-page',
    imports: [FormsModule, EventCardComponent, ReactiveFormsModule],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})
export class EventsPageComponent {

  events =  signal<MyEvent[]>([]);//Declarem com signal la array
  creator = input.required<string>();
  attending =  input.required<string>();

  #eventsService = inject(EventsService);
  #usersService = inject(UsersService);
  contador = 2;
  hiddenLoadMore = true;
  filtre = signal("");
  text = signal("");
  creatorName = signal("");


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

      if(this.creator() || this.attending()){
        let aux = this.creator() || this.attending();
        this.#usersService.getProfile(Number(aux))
        .subscribe({
          next: (profile) => this.creatorName.set(profile.name)
        });
      }
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

    if(this.attending()){
      this.#eventsService.getEventsAttending(1,this.filtre(),this.search()!,this.attending())
      .subscribe({
        next: (events) => {
          this.events.set(events.events);
          this.contador = 2;
          this.hiddenLoadMore = events.more;
          this.text.set("Events Attended by "+ this.creatorName() +". Filtered by "+ this.search() +". Ordered by "+ this.filtre());

        },
        error: (error) => console.log(error)
      });

    }else if(this.creator()){
      this.#eventsService.getEventsCreator(1,this.filtre(),this.search()!,this.creator())
      .subscribe({
        next: (events) => {
          this.events.set(events.events);
          this.contador = 2;
          this.hiddenLoadMore = events.more;
          this.text.set("Events created by "+ this.creatorName() +". Filtered by "+ this.search() +". Ordered by "+ this.filtre());
        },
        error: (error) => console.log(error)
      });
    }else{
      this.#eventsService.getEvents(1,this.filtre(),this.search()!,this.creator())
      .subscribe({
        next: (events) => {
          this.events.set(events.events);
          this.contador = 2;
          this.hiddenLoadMore = events.more;
          this.text.set("Events created by "+ this.creatorName() +". Filtered by "+ this.search() +". Ordered by "+ this.filtre());
        },
        error: (error) => console.log(error)
      });
    }
  }


  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((p) => p !== event))
  }

  loadMore(){
    if(this.attending()){
      this.#eventsService.getEventsAttending(1,this.filtre(),this.search()!,this.attending())
      .subscribe({
        next: (events) => {
          this.events.set(this.events().concat(events.events));
          this.contador ++;
          this.hiddenLoadMore = events.more;
        },
        error: (error) => console.log(error)
      });
    } else if(this.creator()){
      this.#eventsService.getEventsCreator(this.contador,this.filtre(),this.search()!, this.creator())
      .subscribe({
        next: (events) => {
          this.events.set(this.events().concat(events.events));
          this.contador ++;
          this.hiddenLoadMore = events.more;
        },
        error: (error) => console.log(error)
      });
    }else{
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




}
