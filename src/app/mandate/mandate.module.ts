import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { Ng2CompleterModule } from "ng2-completer";

import { MandateRoutingModule } from './mandate-routing.module';
import { MandateComponent } from './mandate.component';
import { MandatEditComponent } from './mandat-edit/mandat-edit.component';
import { SharedModule } from '../shared/shared.module';
import { FormService } from '../shared/form.service';

@NgModule({
  imports: [
    CommonModule,
    MandateRoutingModule,
    FormsModule,
    AgmCoreModule,
    SharedModule,
    Ng2CompleterModule
  ],
  declarations: [MandateComponent, MandatEditComponent],
  providers: [FormService]
})
export class MandateModule {}
