import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {FooterType} from './constants/footerType.enum';
import {FooterInfo} from './models/footerInfo.model';
import {FooterTypeService} from './services/footer-type/footer-type.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [],
})
export class FooterComponent {
  readonly footerType = FooterType;
  info$: Observable<FooterInfo>;

  constructor(private footerTypeService: FooterTypeService) {
    this.info$ = this.footerTypeService.createSubscriber();
  }
}
