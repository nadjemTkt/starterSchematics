import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class <%= classify(name) %>Service {

  private <%= camelize(dataName) %> = new BehaviorSubject('First Message');
  shared<%= classify(name) %> = this.<%= camelize(dataName) %>.asObservable();

  constructor() { }

  nextMessage(<%= camelize(dataName) %>: <%= camelize(dataType) %>) {
    this.<%= camelize(dataName) %>.next(<%= camelize(dataName) %>)
  }
  
}