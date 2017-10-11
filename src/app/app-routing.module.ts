import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { MandateComponent } from './mandate/mandate.component';
import { MandateModule } from './mandate/mandate.module';
import { OpReComponent } from './op-re/op-re.component';
import { TimeTrackingComponent } from './mitarbeiter/time-tracking/time-tracking.component';
import { MitarbeiterComponent } from './mitarbeiter/mitarbeiter.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mandate', loadChildren: () => MandateModule },
  // { path: 'mandate', loadChildren: './mandate/mandate.module#MandateModule?sync=true' }, // seems not to be working
  // { path: 'mandate', component: MandateComponent }, // requires the path in the sub routing file to be changed to 'mandate'
  { path: 'dispo', component: OpReComponent },
  { path: 'time', component: TimeTrackingComponent},
  { path: 'mitarbeiter', component: MitarbeiterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
