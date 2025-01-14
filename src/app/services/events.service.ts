import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommentInput, Comments, MyEvent, MyEventInsert } from '../interfaces/my-event';
import { CommentsResponse, EventsResponse, SingleCommentResponse, SingleEventResponse, UsersResponse } from '../interfaces/responses';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  #eventsURL = 'events';
  #http = inject(HttpClient);

  getEvents(page: number, order: string, search: string, creator: string ="0"): Observable<EventsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      order,
      search,
      creator: String(creator)
  });
    return this.#http
      .get<EventsResponse>(`${this.#eventsURL}?${params.toString()}`)
      .pipe(map((resp) => resp));
  }


  getEventsAttending(page: number, order: string, search: string, attending: string): Observable<EventsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      order,
      search
    });

    return this.#http
    .get<EventsResponse>(`${this.#eventsURL}?${params.toString()}&attending=${attending}`)
    .pipe(map((resp) => resp));
  }


  getEvent(id: number): Observable<MyEvent>{
    return this.#http
      .get<SingleEventResponse>(`${this.#eventsURL}/${id}`)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event : MyEventInsert): Observable<MyEvent>{
    return this.#http
      .post<SingleEventResponse>(this.#eventsURL,event)
      .pipe(map((resp) => resp.event));
  }

  updateEvent(event: MyEventInsert, id: number): Observable<void>{
    return this.#http
      .put<void>(`${this.#eventsURL}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void>{
    return this.#http.delete<void>(`${this.#eventsURL}/${id}`);
  }


  getAttendees(id: number): Observable<User[]>{
    return this.#http
      .get<UsersResponse>(`${this.#eventsURL}/${id}/attend`)
      .pipe(map((resp) => resp.users));
  }

  postAttend(id: number) : Observable<void>{
    return this.#http
      .post<void>(`${this.#eventsURL}/${id}/attend`, null);
  }

  deleteAttend(id: number) : Observable<void>{
    return this.#http
      .delete<void>(`${this.#eventsURL}/${id}/attend`);
  }

  getComments(id: number) : Observable<Comments[]>{
    return this.#http
      .get<CommentsResponse>(`${this.#eventsURL}/${id}/comments`)
      .pipe(map((resp) => resp.comments));
  }

  postComment(id: number, comment: CommentInput): Observable<Comments>{
    return this.#http
      .post<SingleCommentResponse>(`${this.#eventsURL}/${id}/comments`, comment)
      .pipe(map((resp) => resp.comment));
  }


}
