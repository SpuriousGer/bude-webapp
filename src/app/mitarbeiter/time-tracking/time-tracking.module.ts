import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeTrackingComponent } from './time-tracking.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [TimeTrackingComponent]
})
export class TimeTrackingModule { }
