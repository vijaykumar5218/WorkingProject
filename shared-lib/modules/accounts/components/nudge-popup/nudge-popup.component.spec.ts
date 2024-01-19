import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {of} from 'rxjs';

import {NudgePopupComponent} from './nudge-popup.component';

describe('NudgePopupComponent', () => {
  let component: NudgePopupComponent;
  let fixture: ComponentFixture<NudgePopupComponent>;
  let createMatchNudgeSpy;
  let accountServiceSpy;

  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'dismiss',
  ]);
  const navParamSpy = jasmine.createSpyObj('NavParams', ['get']);
  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getExternalLinks',
        'openPwebAccountLink',
      ]);

      TestBed.configureTestingModule({
        declarations: [NudgePopupComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: NavParams, useValue: navParamSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NudgePopupComponent);
      component = fixture.componentInstance;
      createMatchNudgeSpy = spyOn(component, 'createMatchNudge');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call creatNudge', () => {
      component.ngOnInit();
      expect(component.createMatchNudge).toHaveBeenCalled();
    });
  });

  describe('createMatchNudge', () => {
    beforeEach(() => {
      createMatchNudgeSpy.and.callThrough();
    });
    describe('when nudgeType will be compare', () => {
      beforeEach(() => {
        component.url = [
          'Your employer matches your contribution up to a certain amount.',
          'Your Employer will match up to 67% of your savings up to 6%.',
        ];
        component.nudgeType = 'compare';
        spyOn(component, 'getColorNumber').and.returnValue(
          'Your employer matches your contribution up to a certain amount.Your Employer will match up to <span class="font-orange">67%</span> of your savings up to <span class="font-orange">6%</span> .'
        );
      });
      it('should set the value of urlConcat', () => {
        component.createMatchNudge();
        expect(component.getColorNumber).toHaveBeenCalledWith(
          component.url[0] + component.url[1]
        );
        expect(component.urlConcat).toEqual(
          'Your employer matches your contribution up to a certain amount.Your Employer will match up to <span class="font-orange">67%</span> of your savings up to <span class="font-orange">6%</span> .'
        );
      });
    });

    describe('when nudgeType will be COMPAREME', () => {
      beforeEach(() => {
        spyOn(component, 'getColorNumber').and.returnValue(
          '<li>between the ages of <span class="font-orange">50</span> and <span class="font-orange">59</span></li> <li>whose annual income is between <span class="font-orange">$40,000</span><span class="font-orange">.00</span> and <span class="font-orange">$79,000</span><span class="font-orange">.00</span>  per year</li> <li>Who are on track for retirement</li>'
        );
        spyOn(component, 'getStringFromHtmlTag').and.returnValue([
          'People like you...',
          'save 13% of their pay.',
        ]);
        component.nudgeType = 'COMPAREME';
        component.tooltipNote =
          '<h1>People like you...</h1> <ul><li>between the ages of 50 and 59</li> <li>whose annual income is between $40,000.00 and $79,000.00 per year</li> <li>Who are on track for retirement</li></ul> <h1>save 13% of their pay.</h1> <p> On track is defined as individuals who fall within the age and annual income ranges shown above who are estimated to have at least 70% of their current annual income available to them starting at their designated retirement age. The estimated income at retirement includes the individual’s anticipated annual rate of return and assumes that regular contributions will be made throughout the years leading up to retirement.</p>';
        component.peopleLikeYouObj = undefined;
      });
      it('should set the value of peopleLikeYouObj', () => {
        component.createMatchNudge();
        expect(component.urlConcat).toEqual(component.tooltipNote);
        expect(component.getStringFromHtmlTag).toHaveBeenCalled();
        expect(component.getColorNumber).toHaveBeenCalled();
        expect(component.peopleLikeYouObj).toEqual({
          header: 'People like you...',
          points:
            '<li>between the ages of <span class="font-orange">50</span> and <span class="font-orange">59</span></li> <li>whose annual income is between <span class="font-orange">$40,000</span><span class="font-orange">.00</span> and <span class="font-orange">$79,000</span><span class="font-orange">.00</span>  per year</li> <li>Who are on track for retirement</li>',
          subHeader:
            '<li>between the ages of <span class="font-orange">50</span> and <span class="font-orange">59</span></li> <li>whose annual income is between <span class="font-orange">$40,000</span><span class="font-orange">.00</span> and <span class="font-orange">$79,000</span><span class="font-orange">.00</span>  per year</li> <li>Who are on track for retirement</li>',
          desc: 'People like you...',
        });
      });
    });
  });

  describe('openMatch', () => {
    it('when nudgeType will be COMPAREME', () => {
      spyOn(component, 'closeDialog');
      component.nudgeType = 'COMPAREME';
      component.openMatch();
      expect(component.closeDialog).toHaveBeenCalled();
    });
    it('when nudgeType will be compare', () => {
      component.nudgeType = 'compare';
      accountServiceSpy.getExternalLinks.and.returnValue(
        of([
          {
            id: 'ACCT_CONTRIB',
            popup: false,
            link: 'http://test.contrib.com',
            label: 'Manage Contributions',
          },
          {
            id: 'ACCT_MINVEST',
            popup: false,
            link: 'http://test.investments.com',
            label: 'Manage Investments',
          },
        ])
      );
      component.openMatch();
      expect(accountServiceSpy.getExternalLinks).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        'http://test.contrib.com'
      );
    });
  });

  describe('getColorNumber', () => {
    const url = [
      'Your employer matches your contribution up to a certain amount.',
      'Your Employer will match up to 67% of your savings up to 6%.',
    ];
    const urlConcat = url[0] + url[1];
    it('should return value', () => {
      const result = component.getColorNumber(urlConcat);
      expect(result).toEqual(
        'Your employer matches your contribution up to a certain amount.Your Employer will match up to <span class="font-orange">6</span><span class="font-orange">7</span><span class="font-orange">%</span> of your savings up to <span class="font-orange">6</span><span class="font-orange">%</span> .'
      );
    });
  });

  describe('getStringFromHtmlTag', () => {
    const url = [
      'Your employer matches your contribution up to a certain amount.',
      'Your Employer will match up to 67% of your savings up to 6%.',
    ];
    const urlConcat = url[0] + url[1];
    it('should return value', () => {
      const result = component.getStringFromHtmlTag(urlConcat, 'p');
      expect(result).toEqual([]);
    });
  });

  describe('closeDialog', () => {
    it('should call closeDialog', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
