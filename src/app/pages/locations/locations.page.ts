import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  public locations = [];
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.locations = this.dataService.getLocations();
  }

  new() {
    this.router.navigateByUrl('/location');
  }

  editLocation(i) {
    this.router.navigateByUrl(`/location/${i}`);
  }

}
