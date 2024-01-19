import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {
  CatchUpContent,
  CatchUpMessageHub,
} from '@web/app/modules/shared/services/content/model/catchup.model';

@Component({
  selector: 'message-center',
  templateUrl: 'message-center.page.html',
  styleUrls: ['message-center.page.scss'],
})
export class MessageCenterPage implements OnInit {
  subscription = new Subscription();
  catchUpMessageData: CatchUpMessageHub;
  catchUpData: CatchUpContent;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.subscription.add(
      this.contentService
        .getCatchUpMessageHub()
        .subscribe((catchup: CatchUpMessageHub) => {
          this.catchUpMessageData = catchup;
        })
    );
    this.fetchCatchupContent();
  }

  fetchCatchupContent() {
    this.subscription.add(
      this.contentService
        .getCatchupContent()
        .subscribe((catchup: CatchUpContent) => {
          this.catchUpData = catchup;
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
