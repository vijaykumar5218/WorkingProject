import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {TypeaheadComponent} from './typeahead.component';
import {
  FilteredRecords,
  FilterOption,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

describe('TypeaheadComponent', () => {
  let component: TypeaheadComponent;
  let fixture: ComponentFixture<TypeaheadComponent>;
  let modalControllerSpy;
  let journeyServiceSpy;
  let mockFilteredList: FilteredRecords;
  let mockValue: FilterOption;
  let filterListSpy;
  let searchTermsSpy;

  beforeEach(
    waitForAsync(() => {
      mockFilteredList = {
        page: 1,
        totalPages: 430,
        totalEntries: 8599,
        options: [
          {
            id: 5,
            name: 'Michigan Career and Technical Institute',
          },
          {
            id: 6,
            name: 'Miami Valley Career Technology Center',
          },
        ],
      };
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getFilteredList',
      ]);
      journeyServiceSpy.getFilteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      searchTermsSpy = jasmine.createSpyObj('searchTerms', ['next']);
      mockValue = {
        id: 5,
        name: 'Michigan Career and Technical Institute',
      };
      TestBed.configureTestingModule({
        declarations: [TypeaheadComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TypeaheadComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      filterListSpy = spyOn(component, 'filterList');
      component['searchTerms'] = searchTermsSpy;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnDestroy', () => {
    spyOn(component.searchTermsSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.searchTermsSubscription.unsubscribe).toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component['loading'] = true;
    });
    it('should call the filterList', () => {
      component.ngOnInit();
      expect(searchTermsSpy.next).toHaveBeenCalledWith(undefined);
      expect(component['loading']).toBeTrue();
    });
  });

  describe('ngOnChanges', () => {
    it('should call filterList and set currentPage if searchValue is defined', () => {
      component['searchValue'] = 'College';
      component.ngOnChanges({
        searchValue: {
          currentValue: 'College',
          previousValue: undefined,
          firstChange: undefined,
          isFirstChange: undefined,
        },
      });
      expect(searchTermsSpy.next).toHaveBeenCalledWith('College');
    });
    it('should not call filterList if searchValue is undefined', () => {
      component.ngOnChanges({});
      expect(searchTermsSpy.next).not.toHaveBeenCalled();
    });
  });

  describe('onItemSelected', () => {
    beforeEach(() => {
      component['selectedValue'] = mockValue;
    });
    it('should call itemSelected and emit selectedValue if isWeb is true', () => {
      component['isWeb'] = true;
      spyOn(component.itemSelected, 'emit');
      component.onItemSelected();
      expect(component.itemSelected.emit).toHaveBeenCalledWith(mockValue);
    });
    it('should dismiss modal and pass selectedValue if isWeb is false', () => {
      component['isWeb'] = false;
      component.onItemSelected();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(mockValue);
    });
  });

  describe('closeDialog', () => {
    it('should close the modal', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('onIonInfinite', () => {
    let mockEvent: Record<string, any>;
    let eventTargetSpy;
    beforeEach(() => {
      mockEvent = {
        target: {
          complete: () => {
            return;
          },
        },
      };
      eventTargetSpy = spyOn(mockEvent.target, 'complete');
      component['searchValue'] = 'College';
    });
    it('should call filterList', () => {
      component.onIonInfinite(mockEvent);
      expect(filterListSpy).toHaveBeenCalledWith(true);
      expect(eventTargetSpy).toHaveBeenCalled();
    });
  });

  describe('filterList', () => {
    let scroll: boolean;
    let mockSearchUrl: string;
    beforeEach(() => {
      filterListSpy.and.callThrough();
      scroll = false;
      component['filteredItems'] = [];
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['searchValue'] = 'College';
      component['loading'] = true;
      journeyServiceSpy.getFilteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
    });
    it('should reset values if scroll is false', async () => {
      scroll = false;
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['loading'] = true;
      component['filteredItems'] = [];
      await component.filterList(scroll);
      expect(component['currentPage']).toEqual(2);
      expect(component['totalPages']).toEqual(430);
      expect(component['loading']).toBeFalse();
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should not reset values if scroll is true', async () => {
      scroll = true;
      component['currentPage'] = 2;
      component['totalPages'] = mockFilteredList.totalPages;
      component['loading'] = false;
      component['filteredItems'] = mockFilteredList.options;
      await component.filterList(scroll);
      expect(component['currentPage']).toEqual(3);
      expect(component['totalPages']).toEqual(430);
      expect(component['loading']).toBeFalse();
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should call getFilteredList if currentPage is  equal to totalPages and scroll is false and Searchvalue is undefined', async () => {
      scroll = false;
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['searchValue'] = undefined;
      mockSearchUrl = 'page=' + component['currentPage'];
      component['filteredItems'] = [
        {
          id: 5,
          name: 'Michigan Career and Technical Institute',
        },
        {
          id: 6,
          name: 'Miami Valley Career Technology Center',
        },
      ];
      await component.filterList(scroll);
      expect(journeyServiceSpy.getFilteredList).toHaveBeenCalledWith(
        mockSearchUrl
      );
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should call getFilteredList if currentPage is  equal to totalPages and scroll is false and Searchvalue is defined', async () => {
      journeyServiceSpy.getFilteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
      scroll = false;
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['searchValue'] = 'C';
      mockSearchUrl = 'page=1&name=C';
      component['filteredItems'] = mockFilteredList.options;
      await component.filterList(scroll);
      expect(journeyServiceSpy.getFilteredList).toHaveBeenCalledWith(
        mockSearchUrl
      );
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should call getFilteredList if currentPage is less than totalPages and scroll is false and Searchvalue is undefined', async () => {
      scroll = false;
      component['currentPage'] = 1;
      component['totalPages'] = 430;
      component['searchValue'] = undefined;
      mockSearchUrl = 'page=' + component['currentPage'];
      component['filteredItems'] = [
        {
          id: 5,
          name: 'Michigan Career and Technical Institute',
        },
        {
          id: 6,
          name: 'Miami Valley Career Technology Center',
        },
      ];
      await component.filterList(scroll);
      expect(journeyServiceSpy.getFilteredList).toHaveBeenCalledWith(
        mockSearchUrl
      );
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should call getFilteredList if currentPage is less than or equal to totalPages and scroll is true and searchValue is undefined', async () => {
      scroll = true;
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['searchValue'] = undefined;
      mockSearchUrl = 'page=' + component['currentPage'];
      mockFilteredList = {
        page: 2,
        totalPages: 430,
        totalEntries: 8599,
        options: [
          {
            id: 5,
            name: 'Michigan Career and Technical Institute',
          },
          {
            id: 6,
            name: 'Miami Valley Career Technology Center',
          },
        ],
      };
      journeyServiceSpy.getFilteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
      await component.filterList(scroll);
      expect(journeyServiceSpy.getFilteredList).toHaveBeenCalledWith(
        mockSearchUrl
      );
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should call getFilteredList if currentPage is less than or equal to totalPages and scroll is true and searchValue is defined', async () => {
      scroll = true;
      component['currentPage'] = 1;
      component['totalPages'] = 1;
      component['searchValue'] = 'College with a space';
      mockSearchUrl =
        'page=' +
        component['currentPage'] +
        '&name=' +
        'College%20with%20a%20space';
      mockFilteredList = {
        page: 2,
        totalPages: 430,
        totalEntries: 8599,
        options: [
          {
            id: 5,
            name: 'Michigan Career and Technical Institute',
          },
          {
            id: 6,
            name: 'Miami Valley Career Technology Center',
          },
        ],
      };
      journeyServiceSpy.getFilteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
      await component.filterList(scroll);
      expect(journeyServiceSpy.getFilteredList).toHaveBeenCalledWith(
        mockSearchUrl
      );
      expect(component['filteredItems']).toEqual(mockFilteredList.options);
    });
    it('should not call getFilteredList if currentPage is greater than totalPages', async () => {
      scroll = true;
      component['currentPage'] = 12;
      component['totalPages'] = 9;
      component.filterList(scroll);
      expect(
        await journeyServiceSpy.getFilteredList
      ).not.toHaveBeenCalledWith();
    });
  });
});
