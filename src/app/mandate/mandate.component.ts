import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-mandate',
  templateUrl: './mandate.component.html',
  styleUrls: ['./mandate.component.css']
})
export class MandateComponent implements OnInit {

  constructor(private afDb: AngularFireDatabase) {}

  ngOnInit() {
  }

}
