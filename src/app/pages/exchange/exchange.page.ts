import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  public source = '';
  public desination = 'postgres';
  
  constructor() { }

  ngOnInit() {
  }

}
