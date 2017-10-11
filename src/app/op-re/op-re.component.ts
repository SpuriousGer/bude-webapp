import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Response } from '@Angular/Http';

import { Subscription } from 'rxjs/Subscription';

import { AgmCoreModule } from '@agm/core';

import { CompleterService, CompleterData } from 'ng2-completer';

import { Location } from './location.interface';
import { TourService } from './tour.service';
import { DataStorageService } from '../shared/data-storage.service';
import { LocListItemComponent } from './loc-list-item/loc-list-item.component';

@Component({
  selector: 'app-op-re',
  templateUrl: './op-re.component.html',
  styleUrls: ['./op-re.component.css']
})
export class OpReComponent implements OnInit, OnDestroy {
  @ViewChildren(LocListItemComponent) listItems: QueryList<LocListItemComponent>;

  lat: number = 47.440178;
  lng: number = 9.085993;
  zoom: number = 9;

  tourModified: Subscription;
  currentLocations: Location[] = [];

  protected dataService: CompleterData;

  constructor(private tourService: TourService, private completerService: CompleterService) {}

  ngOnInit() {
    this.tourModified = this.tourService.routeChanged.subscribe((locations: Location[]) => this.currentLocations = locations);
    this.dataService = this.completerService.local(this.tourService.allLocations, 'address, street, zip, city', 'address');
  }

  searchItemSelected(event) {
    if (event == null) return;
    const selectedItems = this.listItems.filter(item => item.selected);
    this.tourService.modifyLocations(event.originalObject, selectedItems.length === 1 ? selectedItems[0].index : null);
  }

  addTourToFirebase() {
    this.tourService.addTourToFirebase();
  }

  // Not yet relevant
  moveLocation(index: number, newIndex: number) {
    this.tourService.modifyLocations(null, index, newIndex);
  }
  // Not yet relevant
  swapLocations(index1: number, index2: number) {
    if (index2 < index1) [index1, index2] = [index2, index1];
    this.tourService.modifyLocations(null, index1, index2);
    this.tourService.modifyLocations(null, index2 - 1, index1);
  }

  // Testing Functions
  printRoute() {
    console.log(this.tourService.currentTour, this.currentLocations);
    this.listItems
    .filter(item => item.selected)
    .forEach(item => {
      console.log(item.index, item.selected);
    });
  }
  // End Testing Functions

  ngOnDestroy() {
    this.tourModified.unsubscribe();
  }
}
