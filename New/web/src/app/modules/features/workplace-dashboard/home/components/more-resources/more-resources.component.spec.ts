import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {MoreResourcesComponent} from './more-resources.component';

describe('MoreResourcesComponent', () => {
  let component: MoreResourcesComponent;
  let fixture: ComponentFixture<MoreResourcesComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MoreResourcesComponent],
        providers: [],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(MoreResourcesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openLink', () => {
    it('should call openLink and open link', () => {
      spyOn(window, 'open').and.returnValue(window);
      component.openLink(
        'https://myvoyage.intg.voya.com/eportal/preauth.do?s=Vt56CUmMNewst21mbTVwRA11.a9622&page=TXDOWNLOAD&section=quicken&d=15446f0cf1e3b17810d223603434254a58a61001'
      );
      expect(window.open).toHaveBeenCalledWith(
        'https://myvoyage.intg.voya.com/eportal/preauth.do?s=Vt56CUmMNewst21mbTVwRA11.a9622&page=TXDOWNLOAD&section=quicken&d=15446f0cf1e3b17810d223603434254a58a61001',
        '_self'
      );
    });
  });
});
