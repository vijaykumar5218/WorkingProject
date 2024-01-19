import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AddBenefitsPage} from './add-benefits.page';
import {Component, Input} from '@angular/core';

@Component({selector: 'app-add-plan-card', template: ''})
class MockAppAddPlanCard {
  @Input() planName;
}

describe('AddBenefitsPage', () => {
  let component: AddBenefitsPage;
  let fixture: ComponentFixture<AddBenefitsPage>;
  let headerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [AddBenefitsPage, MockAppAddPlanCard],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(AddBenefitsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Add Benefits',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings/summary',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
  });
});
