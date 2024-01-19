import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'journeys-steps-step-image-with-value',
  templateUrl: './imageWithValue.component.html',
  styleUrls: ['./imageWithValue.component.scss'],
})
export class ImageWithValueComponent implements OnInit {
  @ViewChild('img') imageEl: ElementRef;
  @ViewChild('div') divEl: ElementRef;
  @Input() imageUrl: string;
  @Input() value: string;
  @Input() top: string;
  @Input() left: string;
  @Input() fontSize: string;
  isWeb: boolean;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
  }
}
