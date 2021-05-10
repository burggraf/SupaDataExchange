import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  public index = null;
  public location = {
    type: '',
    name: '',
    address: '',
    user: '',
    password: ''
  }
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.index = this.activatedRoute.snapshot.paramMap.get('index');
    if (this.index !== null) {
      this.location = this.getLocations()[this.index];
    }
  }

  save() {
    const locations = this.getLocations();
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
    this.router.navigateByUrl('/locations');
  }

  delete() {
    if (this.index !== null) {
      const locations = this.getLocations();
      locations.splice(this.index, 1);
      localStorage.setItem('locations', JSON.stringify(locations));
      this.router.navigateByUrl('/locations');    
    }
  }


  getLocations() {
    let strLocations = localStorage.getItem('locations');
    let locations = [];
    if (strLocations) {
      locations = JSON.parse(strLocations);
    }
    return locations;
  }
  
}

