import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public getLocations() {
    let strLocations = localStorage.getItem('locations');
    let locations = [];
    if (strLocations) {
      locations = JSON.parse(strLocations);
    }
    return locations;
  }
  public saveLocations(locations) {
    localStorage.setItem('locations', JSON.stringify(locations));
  }

  public getExchanges() {
    let strExchanges = localStorage.getItem('exchanges');
    let exchanges = [];
    if (strExchanges) {
      exchanges = JSON.parse(strExchanges);
    }
    return exchanges;
  }
  public saveExchanges(exchanges) {
    localStorage.setItem('exchanges', JSON.stringify(exchanges));
  }


}
