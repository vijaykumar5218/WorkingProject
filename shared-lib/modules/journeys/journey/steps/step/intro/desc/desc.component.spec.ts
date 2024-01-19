import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {DescComponent} from './desc.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlanTransactionsComponent} from '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions.component';

describe('DescComponent', () => {
  let component: DescComponent;
  let fixture: ComponentFixture<DescComponent>;
  let journeyServiceSpy;
  let routerSpy;
  let modalControllerSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'openModal',
        'openWebView',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      TestBed.configureTestingModule({
        declarations: [DescComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DescComponent);
      component = fixture.componentInstance;
      component.descStrings = [
        {
          text:
            'Did you know your Social Security benefit amount depends on when you decide to apply? ',
        },
        {
          text: 'ssa.gov',
          link: 'https://www.ssa.gov',
          header: 'ssa.gov',
        },
        {
          text:
            ' Hint: the longer you wait, the larger your benefit will be. Start by setting up your account at ',
        },
        {
          text: 'ssa.gov2',
          link: 'https://www.ssa.gov2',
          header: 'ssa.gov2',
        },
      ];
      component.element = {
        id: 'intro',
        header: 'header',
        description: 'description',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openLink', () => {
    it('should call journeyService openWebview if it is a webview', () => {
      component.openLink({
        text: 'ssa.gov',
        link: 'https://www.ssa.gov',
        header: 'ssa.gov',
        toolbar: true,
      });
      expect(journeyServiceSpy.openWebView).toHaveBeenCalledWith(
        'https://www.ssa.gov',
        'ssa.gov',
        true
      );
    });

    it('should call journeyService openWebview if it is a webview and empty header', () => {
      component.openLink({
        text: 'ssa.gov',
        link: 'https://www.ssa.gov',
        header: '',
      });
      expect(journeyServiceSpy.openWebView).toHaveBeenCalledWith(
        'https://www.ssa.gov',
        '',
        undefined
      );
    });
    it('should call journeyservice openModal if it is a video', () => {
      const videoUrl =
        'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=';
      const playerId = 'kaltura_player_1642011223';
      const desc = {
        text: 'ssa.gov',
        videoUrl: videoUrl,
        playerId: playerId,
      };
      component.openLink(desc);

      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({element: desc});
    });

    it('should not call journeyservice openwebview, openModal or navigateByUrl if its not a webview, video or appLink', () => {
      component.openLink({text: 'abc'});
      expect(journeyServiceSpy.openWebView).not.toHaveBeenCalled();
      expect(journeyServiceSpy.openModal).not.toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should not call journeyservice openwebview or openModal if its not a webview or video', () => {
      spyOn(component, 'openAppLink');
      component.openLink({text: 'text', appLink: 'abc'});
      expect(component.openAppLink).toHaveBeenCalledWith('abc');
    });
  });

  describe('openAppLink', () => {
    it('should open claims modal if web and link === claims', () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.openAppLink('claims');

      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: PlanTransactionsComponent,
        componentProps: {
          isModal: true,
        },
      });
    });

    it('should just call navigateByURL if not web and link === claims', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.openAppLink('claims');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('claims');
    });

    it('should just call navigateByURL if not web and link === anything', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.openAppLink('alink');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('alink');
    });
  });
});
