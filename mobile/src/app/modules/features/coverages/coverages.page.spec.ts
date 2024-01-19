import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

import {CoveragesPage} from './coverages.page';

describe('CoveragesPage', () => {
  let component: CoveragesPage;
  let fixture: ComponentFixture<CoveragesPage>;
  let headerTypeServiceSpy;
  let footerTypeServiceSpy;
  let benefitsServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefits',
      ]);
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve());

      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

      TestBed.configureTestingModule({
        declarations: [CoveragesPage],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {
            provide: Router,
            useValue: routerSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CoveragesPage);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Coverages',
        btnright: true,
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
      });
    });

    it('should navigate to coverage-tabs', () => {
      component.ionViewWillEnter();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs'
      );
    });
  });
});
