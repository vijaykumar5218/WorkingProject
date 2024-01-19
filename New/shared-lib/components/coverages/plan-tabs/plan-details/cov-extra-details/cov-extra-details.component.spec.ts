import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {CovExtraDetailsComponent} from './cov-extra-details.component';
import {
  FootNote,
  PlanSumGroupItem,
} from '@shared-lib/services/benefits/models/benefits.model';

describe('CovExtraDetailsComponent', () => {
  let component: CovExtraDetailsComponent;
  let fixture: ComponentFixture<CovExtraDetailsComponent>;
  let utilityServiceSpy;
  let notesSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      TestBed.configureTestingModule({
        declarations: [CovExtraDetailsComponent],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      utilityServiceSpy.getIsWeb.and.returnValue(true);

      fixture = TestBed.createComponent(CovExtraDetailsComponent);
      component = fixture.componentInstance;

      notesSpy = spyOn(component, 'setupNotes');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toBeTrue();
    });
  });

  describe('setupNotes', () => {
    beforeEach(() => {
      notesSpy.and.callThrough();
    });

    it('should get ids for notes from each item, and find that note in the footnotes', () => {
      const note1: FootNote = {
        name: 'note:1',
        note: 'test note',
        type: 'note',
      };
      const note2: FootNote = {
        name: 'note:2',
        note: 'test note',
        type: 'note',
      };
      component.notes = [note1, note2];

      const item1 = {
        footnotes: ['note:1'],
      } as PlanSumGroupItem;
      const item2 = {
        footnotes: ['note:2'],
      } as PlanSumGroupItem;
      const item3 = {
        footnotes: ['note:1'],
      } as PlanSumGroupItem;

      component.planSummaryGroup = {
        label: '',
        name: '',
        items: [item1, item2, item3],
      };

      component.setupNotes();

      expect(component.currentNotes).toEqual([note1, note2, note1]);
    });
  });

  describe('toggle', () => {
    it('should flip expanded flag', () => {
      component.expanded = true;
      component.toggle();
      expect(component.expanded).toBeFalse();
    });
  });
});
