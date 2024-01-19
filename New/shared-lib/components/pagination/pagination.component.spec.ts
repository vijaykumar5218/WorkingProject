import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {PaginationComponent} from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaginationComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(PaginationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('paginateClick', () => {
    beforeEach(() => {
      spyOn(component.paginationChange, 'emit');
    });
    it('should call paginationChange', () => {
      component.paginationConfig = JSON.stringify({
        conjunction: '',
        currentPage: 1,
        itemsPerPage: 5,
        dataSize: 10,
      });
      component.paginateClick({
        detail: {
          pageIndex: [0, 19],
        },
      });
      expect(component.paginationChange.emit).toHaveBeenCalledWith(1);
    });
  });
});
