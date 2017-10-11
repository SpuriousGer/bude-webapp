import { Component, OnInit, Input } from '@angular/core';

import { Location } from '../location.interface';
import { TourService } from '../tour.service';

@Component({
  selector: 'app-loc-list-item',
  templateUrl: './loc-list-item.component.html',
  styleUrls: ['./loc-list-item.component.css']
})
export class LocListItemComponent implements OnInit {
  @Input() loc: Location;
  @Input('i') index: number;
  selected: boolean = false;

  constructor(private tourService: TourService) { }

  ngOnInit() {
  }

  onLocationSelect() {
    this.selected = !this.selected;
  }

  onLocationDelete(index: number) {
    this.tourService.modifyLocations(null, index);
  }

}
