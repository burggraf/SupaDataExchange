import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.page.html',
  styleUrls: ['./exchanges.page.scss'],
})
export class ExchangesPage implements OnInit {
  public exchanges = [];
  public index = null;
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.exchanges = this.dataService.getExchanges();

  }

  new() {
    this.router.navigateByUrl('/exchange');
  }

  editExchange(i) {
    this.router.navigateByUrl(`/exchange/${i}`);
  }




}
