import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangesPageRoutingModule } from './exchanges-routing.module';

import { ExchangesPage } from './exchanges.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangesPageRoutingModule
  ],
  declarations: [ExchangesPage]
})
export class ExchangesPageModule {}
