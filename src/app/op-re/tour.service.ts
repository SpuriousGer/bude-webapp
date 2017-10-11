import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { Location } from './location.interface';
import { Route } from './route.interface';
import { Tour } from './tour.model';

@Injectable()
export class TourService {
  routeChanged = new Subject<Location[]>();
  allLocations: FirebaseListObservable<Location[]>;

  downloadedLocations: Location[] = [];
  downloadedRoutes: Route[] = [];
  currentTour: Tour = new Tour();

  constructor(private afDb: AngularFireDatabase) {
    this.currentTour.userCreated = 'admin';
    this.allLocations = this.afDb.list('locations');
  }

  modifyLocations(loc?: any, index?: number, newIndex?: number) {
    var locations$: Observable<any> | [Observable<any[]>, Observable<any[]>] = Observable.from(this.currentTour.locIds);
    var routes$: Observable<any>;

    if (newIndex) {
       // console.log('rearrange', arguments);
       //ändern weil momentan swap nicht rearrange
      locations$ = Observable.concat(
          locations$.take(index),
          locations$
            .take(newIndex)
            .skip(index + 1)
            .startWith(this.currentTour.locIds[newIndex]),
          locations$
            .skip(newIndex + 1)
            .startWith(this.currentTour.locIds[index])
      );
    } else if (index == null) {
      // console.log('add', arguments);
      const locKey = loc.$key;
      if (this.downloadedLocations[locKey] == null) this.downloadedLocations[locKey] = this.returnLocationObject(loc);
      locations$ = locations$.concat(Observable.of(locKey));
    } else if (loc == null) {
      // console.log('delete', arguments);
      locations$ = Observable.concat(
          locations$.take(index),
          locations$.skip(index + 1)
      );
    } else if (loc) {
      // console.log('edit', arguments);
      const locKey = loc.$key;
      if (this.downloadedLocations[locKey] == null) this.downloadedLocations[locKey] = this.returnLocationObject(loc);
      locations$ = Observable.concat(
          locations$.take(index),
          locations$
            .skip(index + 1)
            .startWith(locKey)
       );
    } else {
      console.error('Not enough parameters provided', {
        "loc": loc,
        "index": index,
        "newIndex": newIndex
      });
    }
    locations$ = locations$.distinctUntilChanged();
    this.currentTour.resetCalculation();

    routes$ = locations$.pairwise().map(x => x[0] + x[1]);

    routes$.switchMap(x => {
      var route$: Observable<Route | any>;
      if(this.downloadedRoutes[x] == null) {
        route$ = this.afDb.object('routes/' + x).do(route => this.downloadedRoutes[route.$key] = route);
      } else {
        route$ = Observable.of(this.downloadedRoutes[x]);
      }
      return route$.map(route => [x, route]);
    }).subscribe(x => this.currentTour.addRoute(x[0], x[1]));

    locations$ = locations$.map((x, i) => [x, i]).partition(x => this.downloadedLocations[x[0]].latitude != null && this.downloadedLocations[x[0]].longitude != null);

    locations$[0].subscribe(x => {
      this.currentTour.locIds[x[1]] = x[0];
      this.currentTour.locs[x[1]] = this.downloadedLocations[x[0]];
      this.routeChanged.next(this.currentTour.getLocations());
    });

    locations$[1]
      .do(x => this.currentTour.locIds[x[1]] = x[0])
      .switchMap(x => this.getLocationGPSFromFirebase(x[0]).map(result => this.returnLocationObject(Object.assign(this.downloadedLocations[x[0]], result)))
                        .do(y => this.currentTour.locs[x[1]] = y)
                        .do(y => this.downloadedLocations[x[0]] = y)
      )
      .subscribe(x => this.routeChanged.next(this.currentTour.getLocations()));
  }

  getLocations() {
    return this.currentTour.getLocations();
  }

  returnLocationObject(loc: Location) {
    return {
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      altitude: loc.altitude,
      street: loc.street,
      zip: loc.zip,
      city: loc.city,
      country: loc.country,
      googlePlacesId: loc.googlePlacesId,
      polylineCoordinates: loc.polylineCoordinates
    };
  }

  getLocationGPSFromFirebase(key: string) {
    return this.afDb.object('locationGPS/' + key).map(result => {
      return {
        "latitude": <number>result.latitude,
        "longitude": <number>result.longitude,
        "altitude": <number>result.altitude
      }
    }).first();
  }

  addTourToFirebase() {
    const tourObjects = this.currentTour.getFirebaseObjects();
    const newTourPushID = this.afDb.list('tours').push(tourObjects.tours);
    this.afDb.list('metaTour/' + newTourPushID.key).push(tourObjects.metaTour);
  }

  getNumberStops() {
    return this.currentTour.stops;
  }

  getTravelTime() {
    const time = this.currentTour.travelTime;
    const hours = Math.floor(time / 3600);
    const minutes = Math.round((time % 3600) / 60);
    return (hours + ":" + ('0' + minutes).slice(-2) + 'h');
  }

  getTravelDistance() {
    return (this.currentTour.travelDistance / 1000).toFixed(2) + 'km';
  }

  getWorkTime() {
    return (this.currentTour.workTime / (60 * 60)).toFixed(1) + 'h';
  }
}