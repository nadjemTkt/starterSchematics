import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class <%= classify(name) %>Component implements OnInit {
  public componentName = "<%= dasherize(name) %>";
  constructor() { }

  ngOnInit(): void {
  }

}