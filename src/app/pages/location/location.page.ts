import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  public index = null;
  public locations = [];
  public location = {
    type: '',
    name: '',
    address: '',
    u: '',
    p: ''
  }
  constructor(private _location: Location, private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.locations = this.dataService.getLocations();
    this.index = this.activatedRoute.snapshot.paramMap.get('index');
    if (this.index !== null) {
      this.location = this.locations[this.index];
    }
  }
  save() {
    const result = this.locations.findIndex(obj => {
      return obj.name === this.location.name;
    });
    if (result > -1) {
      this.locations[result] = this.location;
    } else {
      this.locations.push(this.location);
    }
    this.dataService.saveLocations(this.locations);
    this._location.back();
    // this.router.navigateByUrl('/locations');
  }

  delete() {
    if (this.index !== null) {
      this.locations.splice(this.index, 1);
      this.dataService.saveLocations(this.locations);
      this._location.back();
      // this.router.navigateByUrl('/locations');
      }
  }


  
}

