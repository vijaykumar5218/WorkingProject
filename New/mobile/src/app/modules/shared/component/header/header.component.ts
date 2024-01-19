import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HeaderInfo} from '@shared-lib/models/headerInfo.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly headerType = HeaderType;
  info: HeaderInfo;
  private infoSubscription: Subscription;
  constructor(private headerTypeService: HeaderTypeService) {}

  ngOnInit() {
    this.infoSubscription = this.headerTypeService
      .createSubscriber()
      .subscribe(info => {
        if (info.type) {
          this.info = info;
        }
      });
  }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }
}
