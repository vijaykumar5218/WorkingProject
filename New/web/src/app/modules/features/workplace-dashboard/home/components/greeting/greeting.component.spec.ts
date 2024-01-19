import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {GreetingComponent} from './greeting.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {GreetingService} from '../../../../../shared/services/greeting/greeting.service';
import * as PageText from '../../constants/workplace-dashboard-content.json';
import {MVlandingContent} from '../../models/mvlandingcontent.model';
import {of} from 'rxjs';

describe('GreetingComponent', () => {
  const pageText: MVlandingContent = (PageText as any).default;
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;
  let accountServiceSpy;
  let greetingServiceeSpy;
  let fetchDisplayNameSpy;
  let fetchGreetingTextSpy;

  beforeEach(
    waitForAsync(() => {
      greetingServiceeSpy = jasmine.createSpyObj('greetingServiceeSpy', [
        'getIsMorningFlag',
        'getIsEveningFlag',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getParticipant',
        'getDisplayNameOrFirstOrLast',
      ]);
      TestBed.configureTestingModule({
        declarations: [GreetingComponent],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: GreetingService, useValue: greetingServiceeSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(GreetingComponent);
      component = fixture.componentInstance;
      fetchDisplayNameSpy = spyOn(component, 'fetchDisplayName');
      fetchGreetingTextSpy = spyOn(component, 'fetchGreetingText');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchDisplayName', () => {
      expect(component.fetchDisplayName).toHaveBeenCalled();
    });
    it('should called fetchGreetingText', () => {
      expect(component.fetchGreetingText).toHaveBeenCalled();
    });
  });

  describe('fetchGreetingText', () => {
    beforeEach(() => {
      fetchGreetingTextSpy.and.callThrough();
    });
    it('should call fetchGreetingText for morning', () => {
      component.isMorning = true;
      component.isEvening = false;
      component.fetchGreetingText();
      expect(component.greetingText).toEqual(pageText.morningGreetingTxt);
    });
    it('should call fetchGreetingText for evening', () => {
      component.isMorning = false;
      component.isEvening = true;
      component.fetchGreetingText();
      expect(component.greetingText).toEqual(pageText.eveningGreetingTxt);
    });
    it('should call fetchGreetingText for afternoon', () => {
      component.isMorning = false;
      component.isEvening = false;
      component.fetchGreetingText();
      expect(component.greetingText).toEqual(pageText.afternoonGreetingTxt);
    });
  });

  describe('fetchDisplayName', () => {
    it('should call getParticipant then call getDisplayName when nameDobDiff is false', async () => {
      const participantData = {
        firstName: 'VILJAMI',
        lastName: 'AILIN-DP',
        birthDate: '',
        displayName: 'VILJAMI AILIN-DP',
        nameDobDiff: false,
        age: '',

        profileId: 'profileId',
      };
      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
      fetchDisplayNameSpy.and.callThrough();
      accountServiceSpy.getDisplayNameOrFirstOrLast.and.returnValue(
        'testDisplayName'
      );
      component.participantName = undefined;
      await component.fetchDisplayName();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(
        accountServiceSpy.getDisplayNameOrFirstOrLast
      ).toHaveBeenCalledWith(participantData);
      expect(component.participantName).toEqual('testDisplayName');
    });

    it('should call getParticipant then display Participant as name when nameDobDiff is true', async () => {
      const participantData = {
        firstName: 'VILJAMI',
        lastName: 'AILIN-DP',
        birthDate: '',
        displayName: 'VILJAMI AILIN-DP',
        age: '',
        nameDobDiff: true,
        profileId: 'profileId',
      };
      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
      fetchDisplayNameSpy.and.callThrough();
      accountServiceSpy.getDisplayNameOrFirstOrLast.and.returnValue(
        'testDisplayName'
      );
      component.participantName = undefined;
      await component.fetchDisplayName();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(component.participantName).toEqual('Participant');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
