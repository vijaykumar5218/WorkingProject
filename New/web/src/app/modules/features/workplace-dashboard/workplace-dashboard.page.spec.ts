import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {WorkplaceDashboardPage} from './workplace-dashboard.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderTypeService} from '../../shared/services/header-type/header-type.service';

describe('WorkplaceDashboardPage', () => {
  let component: WorkplaceDashboardPage;
  let fixture: ComponentFixture<WorkplaceDashboardPage>;
  let headerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      TestBed.configureTestingModule({
        declarations: [WorkplaceDashboardPage],
        imports: [RouterTestingModule],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WorkplaceDashboardPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it('should set HOME to publishSelectedTab', () => {
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'HOME'
      );
    });
  });
});
