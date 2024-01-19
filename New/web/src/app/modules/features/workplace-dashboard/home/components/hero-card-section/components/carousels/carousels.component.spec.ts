import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CarouselsComponent} from './carousels.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {of, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ModalController} from '@ionic/angular';
import {AddAccountModalComponent} from '@web/app/modules/features/workplace-dashboard/home/components/hero-card-section/components/landing-add-account/components/add-account-modal/add-account-modal.component';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Router} from '@angular/router';
import {TourOfSite} from '@shared-lib/modules/tour-of-site/tour-of-site';

describe('CorouselsComponent', () => {
  let component: CarouselsComponent;
  let fixture: ComponentFixture<CarouselsComponent>;
  let contentServiceSpy;
  let modalControllerSpy;
  let utilityServiceSpy;
  let accessServiceSpy;
  let routerSpy;
  let tourOfSiteSpy;

  const carouselDataMockup =
    '{ "heroCarousel" :[{ "sectionHeader": "Manage Your Financial Wellbeing", "image": "https://cdn1-originals.webdamdb.com/13947_149809383?cache=1684505128&response-content-disposition=inline;filename=Pre_Assessment_enus.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MzgzP2NhY2hlPTE2ODQ1MDUxMjgmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UHJlX0Fzc2Vzc21lbnRfZW51cy5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=PMc3Bv1izpEP8-QGULy0XJMStt4je08YY9ghz1wgo8IaBCvEn222vBj2tIEwgdkaC6FYwi~bAY0n5j3A8EooflVccnMHuw2rNfmtWKjHc5CrZ6l51XytmDUzdwUT8Oxdym-hXECiiZoE1IjBQ2GZcBnuhj9bNcCr50fVBYOQgvSc7klE8CAiGmmTWY39inBIll3S8kVVREqRmbkkiO7zUyK7z2nb2xH1wAGx1Z3u5UgfSSgXMfhv-NRZUpJjeAY0zznz5mv37nUEpgIHpP1mcXbYAEfR7UizpMoT-13MbXqcIkRbGULQv3gYqIwc10LpFgXJ1Mnt2q~qZLEqWkNQYw__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Take the Financial Wellbeing Assessment","bodyText": "Answer some simple questions to get a personalized dashboard with steps to help you grow your financial situation.","buttonLabel": "Get Started","url": "URL"},{"sectionHeader": "Update Your Information","image": "https://cdn1-originals.webdamdb.com/13947_149809166?cache=1684505023&response-content-disposition=inline;filename=Post_Assessment.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MTY2P2NhY2hlPTE2ODQ1MDUwMjMmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UG9zdF9Bc3Nlc3NtZW50LnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=aebcraRjKRCV9HpYg~x7475e6o~UPO4rrLdSUIRLVTqXdSQF5owWtGf0mq~cZuWWpgbfHme1NBkYimKIn8J8OKA6h7~L~RmX~EWaFi9Tc~4a3xI1xSZDvGj02IWwF-ugFnXCupA8p2fw6Lr6bt0qIi5CL6dUyYZYFd8ElSkOZmXKed6l-MHZ-dCjcwtBxN52AvNbwDGogs24oxPcMGcO8rCbjEHxIbVSuMueyy5d5QDm5lyBgF8iD7teJXtSRHRJsZLmUvJ5eUlTvgIyaP~dmOzJZIwRRXhWjT7Ahko1Gos77uNfzzO4sWUv2yoUR32UyOYA9c187VK0ATuuBZMIgA__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Stay on top of your Financial Wellbeing","bodyText": "Keeping your information up to date will make sure you are receiving the best recommendations to help you grow your Financial Wellbeing.","buttonLabel": "Update your assessment","url": "URL"},{"sectionHeader": "Adding Accounts","image": "assets/icon/account-type/add-account-header.svg","bodyTitle": "Did you know that you can add your accounts to your dashboard?","bodyText": "Your money might be better, when it’s together. Add in all of your financial accounts to quickly see how much you have, and how small steps can get you closer to your goals.","buttonLabel": "Add Account","url": "URL"},{"sectionHeader": "Your Financial Strength Score","image": "assets/icon/account-type/add-account-header.svg","bodyTitle": "Status: Building","bodyText": "People who are still building toward stability may have trouble dealing with surprise expenses and may miss bill payments regularly.","ctaLabel": "View Complete Financial summary","url": "URL"}]}';
  const singleCarouselDataMockup =
    '{ "heroCarousel" :[{ "sectionHeader": "Manage Your Financial Wellbeing", "image": "https://cdn1-originals.webdamdb.com/13947_149809383?cache=1684505128&response-content-disposition=inline;filename=Pre_Assessment_enus.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MzgzP2NhY2hlPTE2ODQ1MDUxMjgmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UHJlX0Fzc2Vzc21lbnRfZW51cy5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=PMc3Bv1izpEP8-QGULy0XJMStt4je08YY9ghz1wgo8IaBCvEn222vBj2tIEwgdkaC6FYwi~bAY0n5j3A8EooflVccnMHuw2rNfmtWKjHc5CrZ6l51XytmDUzdwUT8Oxdym-hXECiiZoE1IjBQ2GZcBnuhj9bNcCr50fVBYOQgvSc7klE8CAiGmmTWY39inBIll3S8kVVREqRmbkkiO7zUyK7z2nb2xH1wAGx1Z3u5UgfSSgXMfhv-NRZUpJjeAY0zznz5mv37nUEpgIHpP1mcXbYAEfR7UizpMoT-13MbXqcIkRbGULQv3gYqIwc10LpFgXJ1Mnt2q~qZLEqWkNQYw__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Take the Financial Wellbeing Assessment","bodyText": "Answer some simple questions to get a personalized dashboard with steps to help you grow your financial situation.","buttonLabel": "Get Started","url": "URL"}]}';
  const noCarouselDataMockup = '{ "heroCarousel" :[]}';
  const pageTextMockup =
    '{ "sectionHeader": "Manage Your Financial Wellbeing", "image": "https://cdn1-originals.webdamdb.com/13947_149809383?cache=1684505128&response-content-disposition=inline;filename=Pre_Assessment_enus.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MzgzP2NhY2hlPTE2ODQ1MDUxMjgmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UHJlX0Fzc2Vzc21lbnRfZW51cy5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=PMc3Bv1izpEP8-QGULy0XJMStt4je08YY9ghz1wgo8IaBCvEn222vBj2tIEwgdkaC6FYwi~bAY0n5j3A8EooflVccnMHuw2rNfmtWKjHc5CrZ6l51XytmDUzdwUT8Oxdym-hXECiiZoE1IjBQ2GZcBnuhj9bNcCr50fVBYOQgvSc7klE8CAiGmmTWY39inBIll3S8kVVREqRmbkkiO7zUyK7z2nb2xH1wAGx1Z3u5UgfSSgXMfhv-NRZUpJjeAY0zznz5mv37nUEpgIHpP1mcXbYAEfR7UizpMoT-13MbXqcIkRbGULQv3gYqIwc10LpFgXJ1Mnt2q~qZLEqWkNQYw__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Take the Financial Wellbeing Assessment","bodyText": "Answer some simple questions to get a personalized dashboard with steps to help you grow your financial situation.","buttonLabel": "Get Started","url": "URL"}';
  beforeEach(() => {
    contentServiceSpy = jasmine.createSpyObj('contentServiceSpy', [
      'getLandingAddAccountCarousels',
    ]);
    contentServiceSpy.getLandingAddAccountCarousels.and.returnValue({
      subscribe: () => undefined,
    });
    utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
      'setSuppressHeaderFooter',
    ]);
    accessServiceSpy = jasmine.createSpyObj('AccessService', [
      'resetAccordionData',
    ]);
    accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
      'checkMyvoyageAccess',
    ]);
    accessServiceSpy.checkMyvoyageAccess.and.returnValue(
      Promise.resolve({isAltAccessUser: true})
    );

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    tourOfSiteSpy = jasmine.createSpyObj('tourOfSiteSpy', ['launch'])

    TestBed.configureTestingModule({
      declarations: [CarouselsComponent],
      imports: [RouterTestingModule],
      providers: [
        {provide: ContentService, useValue: contentServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: ModalController, useValue: modalControllerSpy},
        {provide: AccessService, useValue: accessServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: TourOfSite, useValue: tourOfSiteSpy},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CarouselsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    const mockcorouselData = JSON.parse(carouselDataMockup);
    beforeEach(() => {
      component.carouselData = undefined;
      component.isPagination = undefined;
      component.isCarouselRequired = undefined;
      observable = of(mockcorouselData);
      subscription = new Subscription();
      spyOn(component['displayCarousel'], 'emit');
      spyOn(component['subscription'], 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockcorouselData);
        return subscription;
      });
      contentServiceSpy.getLandingAddAccountCarousels.and.returnValue(
        observable
      );
    });

    it('should call the managePaginationConfig, set displayCarousel Value and set the value of corouselData, pageText ', () => {
      const managePaginationConfigSpy = spyOn(
        component,
        'managePaginationConfig'
      );
      component.ngOnInit();
      expect(
        contentServiceSpy.getLandingAddAccountCarousels
      ).toHaveBeenCalled();
      expect(component.carouselData).toEqual(JSON.parse(carouselDataMockup));
      expect(component.isPagination).toBeTrue();
      expect(component.displayCarousel.emit).toHaveBeenCalledWith(true);
      expect(component.isCarouselRequired).toBeTrue();
      expect(component.pageText).toEqual(JSON.parse(pageTextMockup));
      expect(managePaginationConfigSpy).toHaveBeenCalledWith(1);
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });

    it('should NOT call managePaginationConfig ,set displayCarousel Value and set the value of corouselData', () => {
      const mockSinglecorouselData = JSON.parse(singleCarouselDataMockup);
      observable = of(mockSinglecorouselData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockSinglecorouselData);
        return subscription;
      });
      contentServiceSpy.getLandingAddAccountCarousels.and.returnValue(
        observable
      );
      const managePaginationConfigSpy = spyOn(
        component,
        'managePaginationConfig'
      );
      component.ngOnInit();
      expect(
        contentServiceSpy.getLandingAddAccountCarousels
      ).toHaveBeenCalled();
      expect(component.carouselData).toEqual(
        JSON.parse(singleCarouselDataMockup)
      );
      expect(component.pageText).toEqual(JSON.parse(pageTextMockup));
      expect(component.isPagination).toBeFalse();
      expect(component.displayCarousel.emit).toHaveBeenCalledWith(true);
      expect(component.isCarouselRequired).toBeTrue();
      expect(managePaginationConfigSpy).not.toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
    it('should NOT call managePaginationConfig ,set displayCarousel Value to false and set the value of corouselData', () => {
      const mockNoCorouselData = JSON.parse(noCarouselDataMockup);
      observable = of(mockNoCorouselData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockNoCorouselData);
        return subscription;
      });
      contentServiceSpy.getLandingAddAccountCarousels.and.returnValue(
        observable
      );
      const managePaginationConfigSpy = spyOn(
        component,
        'managePaginationConfig'
      );
      component.ngOnInit();
      expect(
        contentServiceSpy.getLandingAddAccountCarousels
      ).toHaveBeenCalled();
      expect(component.carouselData).toEqual(JSON.parse(noCarouselDataMockup));
      expect(component.pageText).toBeUndefined;
      expect(component.isPagination).toBeFalse();
      expect(component.displayCarousel.emit).toHaveBeenCalledWith(false);
      expect(component.isCarouselRequired).toBeFalse();
      expect(managePaginationConfigSpy).not.toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
    it('should call checkMyvoyageAccess and set altAccessUser to true', () => {
      component.ngOnInit();
      component.isAltAccessUser = true;
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isAltAccessUser).toBeTrue();
    });


  });

  describe('managePaginationConfig', () => {
    it('should set the value of currentPage, totalItems & paginationConfig', () => {
      component.carouselData = JSON.parse(carouselDataMockup);
      component.managePaginationConfig(1);
      expect(component.currentPage).toEqual(1);
      expect(component.totalItems).toEqual(4);
      expect(component.paginationConfig).toEqual(
        JSON.stringify({
          conjunction: '',
          currentPage: component.currentPage,
          itemsPerPage: component.itemsPerPage,
          dataSize: component.totalItems,
        })
      );
    });
  });

  describe('openAddAccountModal', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('modalSpy', ['present']);
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });
    it('should call setSuppressHeaderFooter and create, present modal if NOT MX User', async () => {
      component.isMXUser = false;
      await component.openAddAccountModal();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AddAccountModalComponent,
        cssClass: 'modal-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('should redirect to add accounts page is MX User', async () => {
      component.isMXUser = true;
      await component.openAddAccountModal();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/accounts/add-accounts'
      );
    });
  });

  describe('paginationChange', () => {
    beforeEach(() => {
      component.carouselData = JSON.parse(carouselDataMockup);
    });
    it('should call managePaginationConfig and set PageText', () => {
      const managePaginationConfigSpy = spyOn(
        component,
        'managePaginationConfig'
      );
      component.paginationChange(1);
      expect(component.pageText).toEqual(JSON.parse(pageTextMockup));
      expect(managePaginationConfigSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component['subscription'], 'unsubscribe');
    });
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('launchTour()', () => {
      it('should launch tour', () => {
          component.launchTour();
          expect(tourOfSiteSpy.launch).toHaveBeenCalled();
      })
  });

  describe('toggleMinimizeExpand()', () => {
      it('should return NOT minimized', () => {
          component.isMinimized = true;
          component.toggleMinimizeExpand();
          fixture.detectChanges();
          expect(component.isMinimized).toBe(false);
          expect(sessionStorage.getItem('isDashboardCarouselMinimized')).toBe('false');
      });

      it('should return minimized', () => {
          component.isMinimized = false;
          component.toggleMinimizeExpand();
          fixture.detectChanges();
          expect(component.isMinimized).toBe(true);
          expect(sessionStorage.getItem('isDashboardCarouselMinimized')).toBe('true');
      });
  });
});
