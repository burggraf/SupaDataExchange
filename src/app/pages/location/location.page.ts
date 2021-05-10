import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  public location = {
    type: '',
    name: '',
    address: '',
    user: '',
    password: ''
  }
  constructor() { }

  ngOnInit() {
    let strLocations = localStorage.getItem('locations');
    console.log('strLocations', strLocations);
  }

  save() {
    let strLocations = localStorage.getItem('locations');
    let locations = [];
    if (strLocations) {
      locations = JSON.parse(strLocations);
    }
    console.log('locations', locations);
    const result = locations.findIndex(obj => {
      return obj.name === this.location.name;
    });
    if (result > -1) {
      locations[result] = this.location;
    } else {
      locations.push(this.location);
    }
    localStorage.setItem('locations', JSON.stringify(locations));
  }
}
