import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MandateComponent } from './mandate.component';
import { MandatEditComponent } from './mandat-edit/mandat-edit.component';

const routes: Routes = [
  { path: '', component: MandateComponent, children: [
    { path: 'new', component: MandatEditComponent },//, canActivate: [AuthGuard] },
    { path: ':id', redirectTo: ':id/edit', pathMatch: 'full' },
    { path: ':id/edit', component: MandatEditComponent },//, canActivate: [AuthGuard] },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandateRoutingModule { }