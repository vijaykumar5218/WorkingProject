import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NotificationWebPage} from './notification.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderTypeService} from '../../shared/services/header-type/header-type.service';

describe('NotificationWebPage', () => {
  let component: NotificationWebPage;
  let fixture: ComponentFixture<NotificationWebPage>;
  let headerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      TestBed.configureTestingModule({
        declarations: [NotificationWebPage],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(NotificationWebPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
    expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(null);
  });
});
