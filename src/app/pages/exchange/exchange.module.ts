import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangePageRoutingModule } from './exchange-routing.module';

import { ExchangePage } from './exchange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangePageRoutingModule
  ],
  declarations: [ExchangePage]
})
export class ExchangePageModule {}
