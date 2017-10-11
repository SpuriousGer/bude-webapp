import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MaterialModule } from '../material.module';
import { MitarbeiterComponent } from './mitarbeiter.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [MitarbeiterComponent]
})
export class MitarbeiterModule { }
