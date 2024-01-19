import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {SpendingWidgetPage} from './spending-widget.page';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('SpendingWidgetPage', () => {
  let component: SpendingWidgetPage;
  let fixture: ComponentFixture<SpendingWidgetPage>;
  let headerFooterServiceSpy;
  let utilityServiceSpy;
  beforeEach(
    waitForAsync(() => {
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);

      TestBed.configureTestingModule({
        declarations: [SpendingWidgetPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SpendingWidgetPage);
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
    it('Should call to check web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    it('should set height', () => {
      expect(component.height).toEqual('530px');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header, footer, and load mx widget if isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Spending',
            btnleft: true,
            buttonLeft: {
              name: 'Back',
              link: 'account',
            },
          },
        },
        {type: FooterType.none}
      );
    });
    it('should not call publishType if isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).not.toHaveBeenCalled();
    });
  });
});
