import { Component, inject} from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../../services/events.service';
import { Router } from '@angular/router';
import { minDateValidator } from '../../shared/validator/min-date.validator';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'event-form',
  standalone: true,
  imports: [FormsModule, EncodeBase64Directive, ReactiveFormsModule, ValidationClassesDirective, DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {

  #eventsService = inject(EventsService);
  #router = inject(Router);

  #saved = false;

  #fb = inject(NonNullableFormBuilder);
  minDate = new Intl.DateTimeFormat('en-CA').format(new Date());

  newEvent = this.#fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-zA-Z][a-zA-Z ]*$")]],
    date: ['', [Validators.required, minDateValidator(this.minDate)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.0)]],
    image: ['', [Validators.required]]
  });

  imageBase64 = '';



  addEvent(){

    this.#eventsService
      .addEvent({...this.newEvent.getRawValue(), image: this.imageBase64 })
      .subscribe(() => {
        this.#router.navigate(['/events']);
        this.#saved = true;
      });
  }

  canDeactivate() {
    return this.newEvent.pristine || this.#saved || confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }

}
