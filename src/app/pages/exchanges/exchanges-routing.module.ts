import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangesPage } from './exchanges.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangesPageRoutingModule {}
