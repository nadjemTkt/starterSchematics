import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tkt-<%= dasherize(name) %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class <%= classify(name) %>Component implements OnInit {
componentName = <%= dasherize(name) %>;
  constructor() { }

  ngOnInit(): void {
  }

}