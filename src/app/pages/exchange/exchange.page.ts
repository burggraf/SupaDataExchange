import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';


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
  public result = '';

  constructor(
    private http: HttpClient,
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private dataService: DataService,
    private loadingController: LoadingController
  ) { }

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

  async run() {
    console.log('RUN!');
    console.log('this.exchange', this.exchange);
    const sourceIndex = this.locations.findIndex(obj => {
      return obj.name === this.exchange.sourcename;
    });
    const destIndex = this.locations.findIndex(obj => {
      return obj.name === this.exchange.desinationname;
    });
    const source = this.locations[sourceIndex];
    const dest = this.locations[destIndex];
    console.log('*** calling http.post -> http://localhost:8080/run');
    const loading = await this.loadingController.create({
      /// cssClass: 'my-custom-class',
      message: 'Exchanging data...please wait...'
    });
    this.result = '';
    await loading.present();
    this.http.post("http://localhost:8080/run", {
      source: source, 
      destination: dest
    }).subscribe((data: any) => {
      console.log('*** response data', data);
      loading.dismiss();
      if (data.error) {
        this.result = data.error;
      } else {
        this.result = data.result;
      }      
    }, error => {
      console.log(error);
      this.result = JSON.stringify(error);
      loading.dismiss();
    });
  }


}
