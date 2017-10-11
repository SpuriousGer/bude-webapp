import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DataStorageService } from '../shared/data-storage.service';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ],
  declarations: [HeaderComponent, FooterComponent, HomeComponent],
  exports: [
    HeaderComponent, 
    FooterComponent, 
    HomeComponent,
    AppRoutingModule
  ],
  providers: [ 
    DataStorageService
  ]
})
export class CoreModule { }
