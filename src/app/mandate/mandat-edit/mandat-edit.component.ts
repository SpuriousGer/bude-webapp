import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/map'

import { diff } from 'deep-object-diff'

import { AgmCoreModule } from '@agm/core';

import { FormService } from '../../shared/form.service';

@Component({
  selector: 'app-mandat-edit',
  templateUrl: './mandat-edit.component.html',
  styleUrls: ['./mandat-edit.component.css']
})
export class MandatEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') mandatForm: NgForm;

  lat: number = 47.440178;
  lng: number = 9.085993;
  zoom: number = 9;

  invoiceFrequency: string[] = ['Monatlich', 'Quartalsweise', 'Halbjährlich', 'Jährlich', 'Nach Aufwand'];
  invoiceType: string[] = ['Rechnung', 'Akonto', 'Kreditkarte']
  wdays: string[] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  mdays: number[] = new Array(32);

  constructor(private fServ: FormService) { }

  ngOnInit() {
    this.fServ.startListening(this.mandatForm.valueChanges, 450);
  }

  formToConsole() {
    const recordedValues = this.fServ.stopListening();
    this.mandatForm.reset();
    this.fServ.startReplay(recordedValues).subscribe(res => {
      this.mandatForm.form.patchValue(res);
    });
  }

  onSubmit() {
    const recordedValues = this.fServ.stopListening();
  }

  changeState() {
    if (this.fServ.recordingRunning === true) {
      this.fServ.pauseListening();
    } else if (this.fServ.recordingRunning === false) {
      this.fServ.resumeListening(this.mandatForm.value);
    }
  }

  ngOnDestroy() {
    const recordedValues = this.fServ.stopListening();
  }

}
