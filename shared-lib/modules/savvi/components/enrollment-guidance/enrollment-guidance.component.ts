import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-enrollment-guidance',
  templateUrl: './enrollment-guidance.component.html',
  styleUrls: ['enrollment-guidance.component.scss'],
})
export class EnrollmentGuidanceComponent implements OnInit {
  actionOption: ActionOptions = {
    headername: 'myVoyage',
    btnleft: true,
    buttonLeft: {
      name: '',
      link: 'back',
    },
  };
  isWeb: boolean;
  logoBaseUrl: string;
  workplaceEnabled$: Observable<boolean>;
  @ViewChild('savviIframe', {static: true}) iframe: ElementRef;

  constructor(
    private savviService: OpenSavviService,
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private utilityService: SharedUtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.footerType.publish({type: FooterType.none});
    this.isWeb = this.utilityService.getIsWeb();
    this.utilityService.setSuppressHeaderFooter(true);
    const loginUrl = this.utilityService.getEnvironment().loginBaseUrl;
    this.logoBaseUrl = loginUrl.slice(0, loginUrl.length - 1);
    this.workplaceEnabled$ = this.accessService.isMyWorkplaceDashboardEnabled();
  }

  async ionViewWillEnter() {
    this.utilityService.setSuppressHeaderFooter(true);
  }

  async ionViewDidEnter() {
    setTimeout(async () => {
      const frame = this.iframe.nativeElement.cloneNode();
      frame.src = await this.savviService.generateSavviUrl();
      this.iframe.nativeElement.parentNode.replaceChild(
        frame,
        this.iframe.nativeElement
      );
    });
  }

  return() {
    const returnUrl = this.activatedRoute.snapshot.paramMap.get('previousUrl');
    this.router.navigateByUrl(returnUrl);
  }

  ionViewWillLeave() {
    this.utilityService.setSuppressHeaderFooter(false);
  }

  ngOnDestroy() {
    this.savviService.exitCallback();
    this.utilityService.setSuppressHeaderFooter(false);
  }
}
