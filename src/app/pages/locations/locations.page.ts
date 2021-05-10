import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  public locations = [];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.locations = this.getLocations();
  }

  new() {
    this.router.navigateByUrl('/location');
  }

  getLocations() {
    let strLocations = localStorage.getItem('locations');
    let locations = [];
    if (strLocations) {
      locations = JSON.parse(strLocations);
    }
    return locations;
  }
  editLocation(i) {
    this.router.navigateByUrl(`/location/${i}`);
  }

}
