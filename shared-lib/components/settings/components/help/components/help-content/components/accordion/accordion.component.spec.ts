import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AccordionComponent} from './accordion.component';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AccordionComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(AccordionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleAccordion', () => {
    it('should toggle the value of the var to false when true', () => {
      component.isListItemOpened = true;
      component.toggleAccordion();
      expect(component.isListItemOpened).toEqual(false);
    });

    it('should toggle the value of the var to true when false', () => {
      component.isListItemOpened = false;
      component.toggleAccordion();
      expect(component.isListItemOpened).toEqual(true);
    });
  });
});
