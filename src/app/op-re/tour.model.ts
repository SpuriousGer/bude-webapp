import * as firebase from 'firebase';

import { Route } from './route.interface';
import { Location } from './location.interface';

export class Tour {
  locs: Location[]  = [];
  locIds: string[] = [];
  routes: Route[] = [];
  routeIds: string[] = [];
  stops: number = 0;
  travelTime: number = 0;
  travelDistance: number = 0;
  workTime?: number = 0;
  userCreated: string = 'unknown';
  tsCreated: any = firebase.database.ServerValue.TIMESTAMP;

  constructor() {}

  resetCalculation() {
    this.locs = [];
    this.locIds = [];
    this.routes = [];
    this.routeIds = [];
    this.stops = 0;
    this.travelTime = 0;
    this.travelDistance = 0;
    this.workTime = 0;
  }

  addRoute(key: string, route: Route | any) {
    const addedRoute = {
      travelDistance: route.travelDistance,
      travelTime: route.travelTime
    };
    this.routeIds.push(key);
    this.routes.push(addedRoute);
    this.addRouteToCalculation(addedRoute);
  }

  private addRouteToCalculation(route: Route) {
    this.travelDistance = +0 + this.travelDistance + route.travelDistance;
    this.travelTime = +0 + this.travelTime + route.travelTime;
    this.stops = this.locIds.length;
    this.workTime = +0;
  }

  getLocations() {
    return this.locs.slice();
  }

  getFirebaseObjects() {
    return {
      'tours': {
        'routeIds': this.routeIds,
        'locIds': this.locIds,
        'stops': this.stops,
        'travelTime': this.travelTime,
        'travelDistance': this.travelDistance,
        'workTime': this.workTime
      },
      'metaTour': {
        'user': this.userCreated,
        'ts': this.tsCreated
      }
    };
  }
}
