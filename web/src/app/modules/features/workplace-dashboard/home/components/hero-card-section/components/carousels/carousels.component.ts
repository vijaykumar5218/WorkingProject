import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import { Subscription } from 'rxjs';
import {
  LandingAddAccountCarousels,
  LandingAddAccountCarouselItems,
} from '@web/app/modules/shared/services/content/model/landing-add-account-carousel.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ModalController} from '@ionic/angular';
import {AddAccountModalComponent} from '@web/app/modules/features/workplace-dashboard/home/components/hero-card-section/components/landing-add-account/components/add-account-modal/add-account-modal.component';
import {Router} from '@angular/router';
import {TourOfSite} from '@shared-lib/modules/tour-of-site/tour-of-site';
import { AccessService } from '@shared-lib/services/access/access.service';
import {  } from 'cookie'

@Component({
  selector: 'carousels',
  templateUrl: './carousels.component.html',
  styleUrls: ['./carousels.component.scss'],
})
export class CarouselsComponent implements OnInit {
  pageText: LandingAddAccountCarouselItems;
  paginationConfig: string;
  currentPage = 1;
  totalItems: number;
  itemsPerPage = 1;
  isDesktop: boolean;
  subscription: Subscription = new Subscription();
  carouselData: LandingAddAccountCarousels;
  isPagination = false;
  isCarouselRequired: boolean;
  @Output() displayCarousel = new EventEmitter<boolean>();
  w = window;
  @Input() isMXUser: boolean;
  isAltAccessUser = false;
  isMinimized = (sessionStorage.getItem('isDashboardCarouselMinimized') === 'true');


  constructor(
    private contentService: ContentService,
    private utilityService: SharedUtilityService,
    private modalController: ModalController,
    private router: Router,
    private tourOfSite: TourOfSite,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.contentService
        .getLandingAddAccountCarousels()
        .subscribe(carouselData => {
          this.carouselData = carouselData;
          this.isPagination =
            this.carouselData.heroCarousel.length > 1 ? true : false;
          this.isCarouselRequired =
            this.carouselData.heroCarousel.length > 0 ? true : false;
          this.displayCarousel.emit(this.isCarouselRequired);
          this.pageText = this.carouselData.heroCarousel[this.currentPage - 1];
          if (this.isPagination) {
            this.managePaginationConfig(1);
          }
        })
    );
    this.accessService.checkMyvoyageAccess().then(access => {
      this.isAltAccessUser = access.isAltAccessUser;
    });
  }

  managePaginationConfig(page: number) {
    this.currentPage = page;
    this.totalItems = this.carouselData.heroCarousel.length;

    this.paginationConfig = JSON.stringify({
      conjunction: '',
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      dataSize: this.totalItems,
    });
  }

  paginationChange(currentPage: number) {
    this.pageText = this.carouselData.heroCarousel[currentPage - 1];
    this.managePaginationConfig(currentPage);
  }

  async openAddAccountModal() {
    if (this.isMXUser) {
      this.router.navigateByUrl('/accounts/add-accounts');
    } else {
      this.utilityService.setSuppressHeaderFooter(true);
      const modal = await this.modalController.create({
        component: AddAccountModalComponent,
        cssClass: 'modal-fullscreen',
      });
      return modal.present();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  launchTour() {
    this.tourOfSite.launch();
  }

  toggleMinimizeExpand() {
      this.isMinimized = !this.isMinimized;
      sessionStorage.setItem('isDashboardCarouselMinimized', this.isMinimized.toString());
  }
}
