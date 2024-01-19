import {Component, OnInit} from '@angular/core';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private footerType: FooterTypeService) {}

  ngOnInit() {
    this.footerType.publish({type: FooterType.tabsnav});
  }
}
