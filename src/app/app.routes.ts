import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { RegResRevManual } from './pages/reg-res-rev-manual/reg-res-rev-manual';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reg-res-rev-manual', component: RegResRevManual },
];
