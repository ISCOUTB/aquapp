import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor() {}
  private subject = new Subject<any>();

  sendMessage(name: string, value: any = {}) {
    this.subject.next({ nombre: name, valor: value });
  }

  deleteMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
