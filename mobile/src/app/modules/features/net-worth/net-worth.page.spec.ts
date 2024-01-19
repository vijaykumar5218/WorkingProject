import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {NetWorthPage} from './net-worth.page';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('NetWorthPage', () => {
  let component: NetWorthPage;
  let fixture: ComponentFixture<NetWorthPage>;
  let headerFooterServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      TestBed.configureTestingModule({
        declarations: [NetWorthPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NetWorthPage);
      component = fixture.componentInstance;

      component.contentView = {
        nativeElement: {
          offsetHeight: 500,
        },
      };

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set height', () => {
      expect(component.height).toEqual('530px');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header, footer, and load mx widget', () => {
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Net Worth',
            btnleft: true,
            buttonLeft: {
              name: 'Back',
              link: 'back',
            },
          },
        },
        {type: FooterType.none}
      );
    });
  });
});
