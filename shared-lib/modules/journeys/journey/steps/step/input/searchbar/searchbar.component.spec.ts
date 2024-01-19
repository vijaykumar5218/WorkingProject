import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {FilterOption} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {TypeaheadComponent} from '../typeahead/typeahead.component';
import {SearchbarComponent} from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let utilityServiceSpy;
  let modalControllerSpy;
  let modalSpy;
  let mockValue: FilterOption;

  beforeEach(
    waitForAsync(() => {
      mockValue = {
        id: 5,
        name: 'Michigan Career and Technical Institute',
      };
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      modalSpy = jasmine.createSpyObj('modalSpy', ['onDidDismiss', 'present']);
      modalSpy.onDidDismiss.and.returnValue(Promise.resolve({data: mockValue}));
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      TestBed.configureTestingModule({
        declarations: [SearchbarComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not error or set searchValue if defaultValue is not defined', () => {
      expect(component['searchValue']).toBeUndefined();
    });

    it('should parse the defaultValue if it is defined', () => {
      component.defaultValue = JSON.stringify(mockValue);
      component.ngOnInit();
      expect(component['searchValue']).toEqual(mockValue.name);
    });

    it('should set isWeb', () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toBeTrue();
    });
  });

  describe('searchbarInput', () => {
    beforeEach(() => {
      component['searchValue'] = 'College';
    });
    it('should set searchValue and showFilteredList to true', () => {
      component.searchbarInput('College');
      expect(component['searchValue']).toEqual('College');
      expect(component.showFilteredList).toBeTrue();
    });
  });

  describe('searchInput', () => {
    it('should open modal controller with passed options', async () => {
      await component.searchInput();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: TypeaheadComponent,
        cssClass: 'modal-fullscreen',
        componentProps: {
          element: component['element'],
          isWeb: component.isWeb,
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('should call getSelectedItem during onDidDismiss', async () => {
      const getSelectedItemSpy = spyOn(component, 'getSelectedItem');
      await component.searchInput();
      modalSpy.onDidDismiss();
      expect(getSelectedItemSpy).toHaveBeenCalledWith(mockValue);
    });
  });

  describe('getSelectedItem', () => {
    it('should set searchValue and showFilteredList to false', () => {
      component.getSelectedItem(mockValue);
      expect(component['searchValue']).toEqual(mockValue.name);
      expect(component.showFilteredList).toBeFalse();
    });
    it('should call valueChange and emit selected value', () => {
      spyOn(component.valueChange, 'emit');
      component.getSelectedItem(mockValue);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(mockValue)
      );
    });
  });

  describe('deleteSelectedItem', () => {
    it('should not call valueChange if value is defined', () => {
      spyOn(component.valueChange, 'emit');
      component.deleteSelectedItem('College');
      expect(component.valueChange.emit).not.toHaveBeenCalled();
    });
    it('should call valueChange and emit undefined if value is undefined', () => {
      spyOn(component.valueChange, 'emit');
      component.deleteSelectedItem(undefined);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
      expect(component['showFilteredList']).toBeFalse();
    });
  });
});
