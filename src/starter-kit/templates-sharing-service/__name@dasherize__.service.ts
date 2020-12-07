import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject } from 'rxjs';

@Injectable()
export class <%= classify(name) %>Service {

  private <%= camelize(dataName) %> = <%= typeSelector(dataType) %> ;
  shared<%= classify(dataName) %> = this.<%= camelize(dataName) %>.asObservable();

  constructor() { }

  nextMessage(<%= camelize(dataName) %>: <%= camelize(dataType) %>) {
    this.<%= camelize(dataName) %>.next(<%= camelize(dataName) %>)
  }
  
}