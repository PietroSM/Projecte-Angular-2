import { User } from "./user";

export interface MyEventInsert {
  title: string;
  description: string;
  price: number;
  lat: number;
  lng: number;
  address: string;
  image: string;
  date: string;
}

export interface MyEvent extends MyEventInsert {
  id: number;
  creator: User;
  distance: number;
  numAttend: number;
  attend: boolean;
  mine: boolean;
}

export interface Comments {
  id?: number;
  comment: string;
  date: string
  user: User;
}

export interface CommentInput{
  comment: string;
}