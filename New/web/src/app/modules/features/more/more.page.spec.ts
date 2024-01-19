import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MorePage} from './more.page';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {RouterTestingModule} from '@angular/router/testing';

describe('MorePage', () => {
  let component: MorePage;
  let fixture: ComponentFixture<MorePage>;
  let footerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [MorePage],
        providers: [
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(MorePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
      type: FooterType.tabsnav,
      selectedTab: 'more',
    });
  });
});
