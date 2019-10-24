import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Message {
  name: string;
  value: any;
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor() {}
  private subject = new Subject<any>();

  sendMessage(message: Message) {
    this.subject.next(message);
  }

  deleteMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
