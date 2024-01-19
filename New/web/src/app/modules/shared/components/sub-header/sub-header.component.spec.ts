import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SubHeaderComponent} from './sub-header.component';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import {RouterTestingModule} from '@angular/router/testing';

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubHeaderComponent],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClick', () => {
    it('should update the selected tab to the tab that was clicked using link if it is there', () => {
      const selectedTabLink = 'selectedTab';
      const selectedTab: SubHeaderTab = {link: selectedTabLink, label: 'label'};
      spyOn(component.fetchTabLink, 'emit');
      component.selectedTab = undefined;
      component.handleClick(selectedTab);
      expect(component.selectedTab).toEqual(selectedTabLink);
      expect(component.fetchTabLink.emit).toHaveBeenCalledWith(selectedTabLink);
    });
  });
});