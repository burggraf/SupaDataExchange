import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Locations', url: '/locations', icon: 'server' },
    { title: 'Exchanges', url: '/exchanges', icon: 'swap-horizontal' },
  ];
  public labels = [];
  constructor() {}
}
