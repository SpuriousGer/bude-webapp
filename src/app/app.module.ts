import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AgmCoreModule } from '@agm/core';

import 'hammerjs';
import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MandateModule } from './mandate/mandate.module';
import { CoreModule } from './core/core.module';
import { OpReRoutingModule } from './op-re/op-re-routing.module';
import { OpReModule } from './op-re/op-re.module';
import { firebaseConfig } from './core/firebase.config';
import { TimeTrackingModule } from './mitarbeiter/time-tracking/time-tracking.module';
import { MitarbeiterModule } from './mitarbeiter/mitarbeiter.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    SharedModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyALkWHtTaaTxdQWrfdzrt-AnArT9llZ_ck'
    }),
    MandateModule,
    CoreModule,
    OpReRoutingModule,
    OpReModule,
    TimeTrackingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MitarbeiterModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
