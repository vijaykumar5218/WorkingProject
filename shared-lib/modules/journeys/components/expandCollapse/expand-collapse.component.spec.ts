import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '../../../../services/utility/utility.service';
import {ExpandCollapseComponent} from './expand-collapse.component';

describe('ExpandCollapseComponent', () => {
  let component: ExpandCollapseComponent;
  let fixture: ComponentFixture<ExpandCollapseComponent>;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [ExpandCollapseComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ExpandCollapseComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb from utility service', () => {
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      component.isWeb = false;
      component.ngOnInit();
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toBeTrue();
    });
  });

  describe('toggleExpand', () => {
    it('should flip isExpanded', () => {
      component.isExpanded = false;
      spyOn(component.isExpandedChange, 'emit');
      component.toggleExpand();
      expect(component.isExpanded).toBeTrue();
      expect(component.isExpandedChange.emit).toHaveBeenCalledWith(true);
    });
  });
});
