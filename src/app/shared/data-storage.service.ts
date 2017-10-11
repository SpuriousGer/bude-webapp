import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { Location } from '../op-re/location.interface';
import { Route } from '../op-re/route.interface';
import { Tour } from '../op-re/tour.model';

@Injectable()
export class DataStorageService {

  constructor(private afDb: AngularFireDatabase) {}

}
