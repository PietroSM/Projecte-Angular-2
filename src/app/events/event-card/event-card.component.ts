import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  input,
  output,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { MyEvent } from '../../interfaces/my-event';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { User } from '../../interfaces/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'event-card',
  imports: [DatePipe, IntlCurrencyPipe, RouterLink, NgClass],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();
  title = '';
  attendeesChanged = output<void>();

  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  attendees = signal<User[]>([]);
  #modalService = inject(NgbModal);

  eliminar() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Delete';
    modalRef.componentInstance.body = 'you want to delete it?';
    return modalRef.result.then((result) => {
      if (result) {
        this.#eventsService
          .deleteEvent(this.event().id!)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.deleted.emit());
      }
    });
  }

  canviarAttend() {
    if (this.event().attend) {
      this.#eventsService.deleteAttend(this.event().id).subscribe({
        next: () => this.attendeesChanged.emit(),
        error: (error) => console.log(error),
      });

      this.event().attend = false;
      this.event().numAttend = this.event().numAttend - 1;
    } else if (!this.event().attend) {
      this.#eventsService.postAttend(this.event().id).subscribe({
        next: () => this.attendeesChanged.emit(),
        error: (error) => console.log(error),
      });

      this.event().attend = true;
      this.event().numAttend = this.event().numAttend + 1;
    }
  }
}
