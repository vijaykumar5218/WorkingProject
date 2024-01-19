import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {
  CatchUpContent,
  CatchUpMessageHub,
  CatchUp,
} from '@web/app/modules/shared/services/content/model/catchup.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-catch-up-tile',
  templateUrl: './catch-up-tile.component.html',
  styleUrls: ['./catch-up-tile.component.scss'],
})
export class CatchUpTileComponent implements OnInit, OnDestroy {
  catchUpData: CatchUpContent;
  catchUpMessageData: CatchUpMessageHub;
  singleCatchUpMessage: CatchUp;
  private subscription = new Subscription();

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.subscription.add(
      this.contentService
        .getCatchupContent()
        .subscribe((catchup: CatchUpContent) => {
          this.catchUpData = catchup;
        })
    );
    this.fetchCatchUpMessageHub();
  }

  fetchCatchUpMessageHub() {
    this.subscription.add(
      this.contentService
        .getCatchUpMessageHub()
        .subscribe((catchup: CatchUpMessageHub) => {
          catchup.catchUp.forEach(element => {
            if (element.Description.length > 75) {
              element.shortDescription =
                element.Description.slice(0, 75) + '...';
            }
          });
          this.catchUpMessageData = catchup;
        })
    );
  }

  readmore(message: CatchUp) {
    this.singleCatchUpMessage = message;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
