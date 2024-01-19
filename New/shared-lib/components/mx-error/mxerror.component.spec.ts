import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {MXErrorComponent} from './mxerror.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';

describe('MXErrorComponent', () => {
  let component: MXErrorComponent;
  let fixture: ComponentFixture<MXErrorComponent>;
  let checkSpy;
  let mxServiceSpy;
  let utilityServiceSpy;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxMemberConnect',
        'getIsMxUserByMyvoyageAccess',
        'isMxErrorHidden',
        'setMxErrorHidden',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      mxServiceSpy.isMxErrorHidden.and.returnValue(of(true));
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      utilityServiceSpy.getIsWeb.and.returnValue(of(false));
      TestBed.configureTestingModule({
        declarations: [MXErrorComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(MXErrorComponent);
      component = fixture.componentInstance;

      checkSpy = spyOn(component, 'checkForErrors');
      fixture.detectChanges();

      component['subscription'] = jasmine.createSpyObj('subscription', [
        'unsubscribe',
        'add',
      ]);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkForErrors for web false and isMxUser true', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      await component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(checkSpy).toHaveBeenCalled();
    });
    it('should not call checkForErrors for web true and isMxUser false', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));
      await component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    it('should not call checkForErrors web true and isMxUser true', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      await component.ngOnInit();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(checkSpy).toHaveBeenCalled();
    });
    it('should call checkForErrors for mobile', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(undefined);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      await component.ngOnInit();
      expect(checkSpy).toHaveBeenCalled();
    });
  });

  describe('checkForErrors', () => {
    beforeEach(() => {
      checkSpy.and.callThrough();
    });

    it('should subscribe to isMxErrorHidden and set mxErrorHidden to val', () => {
      mxServiceSpy.getMxMemberConnect.and.returnValue(of({members: []}));
      component.mxErrorHidden = false;
      component.checkForErrors();
      expect(mxServiceSpy.isMxErrorHidden).toHaveBeenCalled();
      expect(component.mxErrorHidden).toBeTrue();
    });

    it('should subscribe to getMxMemberConnect and set hasMXError=true if there is one', () => {
      const mem = {
        members: [
          {
            connection_status: 'CONNECTED',
            connection_status_message: '',
            guid: 'aaaaaaaa',
            is_user_created: 'true',
            name: 'MX Bank (Oauth)',
            user_guid: 'bbbbb',
          },
          {
            connection_status: 'PENDING',
            connection_status_message: '',
            guid: 'ccccc',
            is_user_created: 'true',
            name: 'MX Bank (Oauth)',
            user_guid: 'ddddd',
          },
          {
            guid: 'dddddd',
            is_user_created: 'true',
            name: 'Manual Account',
            user_guid: 'ddddd',
          },
        ],
      };

      mxServiceSpy.getMxMemberConnect.and.returnValue(of(mem));
      component.checkForErrors();

      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalled();
      expect(component['hasMXError']).toBeTrue();
    });

    it('should subscribe to getMxMemberConnect and set hasMXError=false if there isnt one', () => {
      const mem = {
        members: [
          {
            connection_status: 'CONNECTED',
            connection_status_message: '',
            guid: 'aaaaaaaa',
            is_user_created: 'true',
            name: 'MX Bank (Oauth)',
            user_guid: 'bbbbb',
          },
          {
            connection_status: 'CONNECTED',
            connection_status_message: '',
            guid: 'ccccc',
            is_user_created: 'true',
            name: 'MX Bank (Oauth)',
            user_guid: 'ddddd',
          },
          {
            guid: 'dddddd',
            is_user_created: 'true',
            name: 'Manual Account',
            user_guid: 'ddddd',
          },
        ],
      };

      mxServiceSpy.getMxMemberConnect.and.returnValue(of(mem));
      component.checkForErrors();

      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalled();
      expect(component['hasMXError']).toBeFalse();
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe to subscription if defined', () => {
        component['subscription'] = new Subscription();
        const subscription = spyOn(component['subscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(subscription).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('closeClicked', () => {
    it('should call mxService setMxErrorHidden', () => {
      component.closeClicked();
      expect(mxServiceSpy.setMxErrorHidden).toHaveBeenCalledWith(true);
    });
  });
});
