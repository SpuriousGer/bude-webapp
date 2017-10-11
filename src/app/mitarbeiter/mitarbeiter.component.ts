import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-mitarbeiter',
  templateUrl: './mitarbeiter.component.html',
  styleUrls: ['./mitarbeiter.component.css']
})
export class MitarbeiterComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'address': [null]
    });
  }

}