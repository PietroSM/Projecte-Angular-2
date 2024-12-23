import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyEvent } from '../interfaces/my-event';
import { EventsResponse, SingleEventResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  #eventsURL = 'events';
  #http = inject(HttpClient);

  getEvents(): Observable<MyEvent[]> {
    return this.#http
      .get<EventsResponse>(this.#eventsURL)
      .pipe(map((resp) => resp.events));
  }

  getEvent(id: number): Observable<MyEvent>{
    return this.#http
      .get<SingleEventResponse>(`${this.#eventsURL}/${id}`)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event : MyEvent): Observable<MyEvent>{
    return this.#http
      .post<SingleEventResponse>(this.#eventsURL,event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void>{
    return this.#http.delete<void>(`${this.#eventsURL}/${id}`);
  }

  postAttend(id: number) : Observable<void>{
    return this.#http
      .post<void>(`${this.#eventsURL}/${id}/attend`, null);
  }

  deleteAttend(id: number) : Observable<void>{
    return this.#http
      .delete<void>(`${this.#eventsURL}/${id}/attend`);
  }


}
