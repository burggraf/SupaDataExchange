import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load',
  templateUrl: './load.page.html',
  styleUrls: ['./load.page.scss'],
})
export class LoadPage implements OnInit {
  public configurations = [];
  constructor() { }

  ngOnInit() {
    const currentID = localStorage.getItem('currentID');
    console.log('currentID', currentID);
    if (currentID) {
      let strConfigs = localStorage.getItem('configurations');
      let configs = [];
      if (strConfigs) {
        configs = JSON.parse(strConfigs);
        console.log('configs', configs);
      }
      this.configurations = configs;
    }
  }

  selectConfig(index) {
    console.log('select', index);
  }
}
