import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventCardComponent } from "../event-card/event-card.component";
import { Title } from '@angular/platform-browser';
import { CommentInput, Comments, MyEvent } from '../../interfaces/my-event';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { User } from '../../interfaces/user';
import { EventsService } from '../../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'event-detail',
    imports: [EventCardComponent, OlMapDirective, OlMarkerDirective, DatePipe, ReactiveFormsModule],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {

  #router = inject(Router);
  #title = inject(Title);
  event = input.required<MyEvent>();
  coordinates = signal<[number, number]>([0, 0]);
  attendees = signal<User[]>([]);
  comments = signal<Comments[]>([]);

  #eventsService = inject(EventsService);


  constructor() {
    effect(() => {
      if(this.event()){
        this.#title.setTitle(this.event()?.description + ' | Angular Events');

        this.#eventsService.getAttendees(this.event().id)
        .subscribe({
          next: (users) => this.attendees.set(users),
          error: (error) => console.log(error)
        });

        this.coordinates.set([this.event().lat, this.event().lng]);
    
        this.#eventsService.getComments(this.event().id)
        .subscribe({
          next: (comments) => this.comments.set(comments),
          error: (error) => console.log(error),
        });

      }
    });
  }


  deleteEvent(){
    this.#router.navigate(['/events']);
  }


  goBack() {
    this.#router.navigate(['/events']);
  }


  actualitzarAttendees(){
    this.#eventsService.getAttendees(this.event().id)
    .subscribe({
      next: (users) => this.attendees.set(users),
      error: (error) => console.log(error)
    });
  }


  #fb = inject(NonNullableFormBuilder);
  commentForm = this.#fb.group({
    comment: ""
  });

  addComment(){
    const newComment: CommentInput = {
      comment: this.commentForm.getRawValue().comment
    };

    this.#eventsService.postComment(this.event().id, newComment)
      .subscribe({
        next: () => {
          this.#eventsService.getComments(this.event().id)
          .subscribe({
            next: (comments) => this.comments.set(comments),
            error: (error) => console.log(error),
          });
        },
        error: (error) => console.log(error)
      });
  }


}
