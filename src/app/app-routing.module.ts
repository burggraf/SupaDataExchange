import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'exchanges',
    loadChildren: () => import('./pages/exchanges/exchanges.module').then( m => m.ExchangesPageModule)
  },
  {
    path: 'exchange',
    loadChildren: () => import('./pages/exchange/exchange.module').then( m => m.ExchangePageModule)
  },
  {
    path: 'exchange/:index',
    loadChildren: () => import('./pages/exchange/exchange.module').then( m => m.ExchangePageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./pages/locations/locations.module').then( m => m.LocationsPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'location/:index',
    loadChildren: () => import('./pages/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'load',
    loadChildren: () => import('./pages/load/load.module').then( m => m.LoadPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
