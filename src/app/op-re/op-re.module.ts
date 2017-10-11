import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { AgmCoreModule } from '@agm/core';

import { Ng2CompleterModule } from "ng2-completer";

import { OpReRoutingModule } from './op-re-routing.module';
import { OpReComponent } from './op-re.component';
import { LocListItemComponent } from './loc-list-item/loc-list-item.component';
import { TourService } from './tour.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    OpReRoutingModule,
    AgmCoreModule,
    SharedModule,
    Ng2CompleterModule,
    FormsModule
  ],
  declarations: [OpReComponent, LocListItemComponent],
  providers: [TourService]
})
export class OpReModule { }
