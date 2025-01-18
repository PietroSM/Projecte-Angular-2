import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, input, numberAttribute, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EventsService } from "../../services/events.service";
import { EncodeBase64Directive } from "../../shared/directives/encode-base64.directive";
import { OlMapDirective } from "../../shared/directives/ol-maps/ol-map.directive";
import { ValidationClassesDirective } from "../../shared/directives/validation-classes.directive";
import { minDateValidator } from "../../shared/validator/min-date.validator";
import { OlMarkerDirective } from "../../shared/directives/ol-maps/ol-marker.directive";
import { GaAutocompleteDirective } from "../../shared/directives/ol-maps/ga-autocomplete.directive";
import { SearchResult } from "../../interfaces/search-result";
import { MyEvent, MyEventInsert } from "../../interfaces/my-event";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "../../shared/modals/confirm-modal/confirm-modal.component";



@Component({
    selector: 'event-form',
    imports: [FormsModule, EncodeBase64Directive, ReactiveFormsModule, ValidationClassesDirective, DatePipe, OlMapDirective, OlMarkerDirective, GaAutocompleteDirective],
    templateUrl: './event-form.component.html',
    styleUrl: './event-form.component.css'
})
export class EventFormComponent {

  #eventsService = inject(EventsService);
  #router = inject(Router);
  #modalService = inject(NgbModal);
  #fb = inject(NonNullableFormBuilder);

  #saved = false;
  imageBase64 = '';
  minDate = new Intl.DateTimeFormat('en-CA').format(new Date());

  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>("");

  id = input.required({ transform: numberAttribute });
  event = input.required<MyEvent>();

  newEvent = this.#fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-zA-Z][a-zA-Z ]*$")]],
    date: ['', [Validators.required, minDateValidator(this.minDate)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    image: ['', [Validators.required]]
  });


  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
  }

  constructor() {
    effect(() => {
      if(this.id()){
            this.newEvent.get('title')?.setValue(this.event().title);
            this.newEvent.get('date')?.setValue(this.event().date.toString().split(' ')[0]);
            this.newEvent.get('description')?.setValue(this.event().description);
            this.newEvent.get('price')?.setValue(this.event().price);

            this.imageBase64 = this.event().image;
            this.coordinates.set([this.event().lng,this.event().lat]);
            this.address.set(this.event().address);
      }
    });
  }


  addEvent(){
    const myEventInsert : MyEventInsert = {
      title: this.newEvent.getRawValue().title,
      description: this.newEvent.getRawValue().description,
      price: this.newEvent.getRawValue().price,
      lat: this.coordinates()[0],
      lng: this.coordinates()[1],
      address: this.address(),
      image: this.imageBase64,
      date: this.newEvent.getRawValue().date
    };


    if(!this.id()){
      this.#eventsService
      .addEvent(myEventInsert)
      .subscribe(() => {
        this.#router.navigate(['/events']);
        this.#saved = true;
      });

    }else{
      this.#eventsService
        .updateEvent(myEventInsert, this.id())
        .subscribe(() =>{
          this.#router.navigate(['/events']);
          this.#saved = true;
        });
    }

  }

  canDeactivate() {
    if (this.newEvent.pristine || this.#saved){
      return true;
    }
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }

}
