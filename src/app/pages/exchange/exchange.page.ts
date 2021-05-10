import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  public index = null;
  public exchanges = [];
  public locations = [];
  public exchange = {
    name: '',
    sourcename: '',
    desinationname: '',
    source: {},
    destination: {}
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.exchanges = this.dataService.getExchanges();
    this.index = this.activatedRoute.snapshot.paramMap.get('index');
    if (this.index !== null) {
      this.exchange = this.exchanges[this.index];
    }
    this.locations = this.dataService.getLocations();
  }

  save() {
    const result = this.exchanges.findIndex(obj => {
      return obj.name === this.exchange.name;
    });
    if (result > -1) {
      this.exchanges[result] = this.exchange;
    } else {
      this.exchanges.push(this.exchange);
    }
    this.dataService.saveExchanges(this.exchanges);
    this.router.navigateByUrl('/exchanges');
  }

  delete() {
    if (this.index !== null) {
      this.exchanges.splice(this.index, 1);
      this.dataService.saveExchanges(this.exchanges);
      this.router.navigateByUrl('/exchanges');    
    }
  }

  sourceChange() {
    console.log('sourceChange()');
    if (this.exchange.sourcename === 'ADD NEW SOURCE LOCATION') {
      setTimeout(() => {
        this.exchange.sourcename = '';
        this.router.navigateByUrl('/location');
      }, 200);
    }
  }

  destinationChange() {
    console.log('destinationChange()');
    if (this.exchange.desinationname === 'ADD NEW DESTINATION LOCATION') {
      setTimeout(() => {
        this.exchange.desinationname = '';
        this.router.navigateByUrl('/location');
      }, 200);
    } else {
      console.log('this.exchange.desinationname', this.exchange.desinationname);
    }
  }


}
