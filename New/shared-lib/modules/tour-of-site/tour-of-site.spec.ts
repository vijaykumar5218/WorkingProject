import { RouterTestingModule } from "@angular/router/testing";
import { TourOfSiteContentItem, TourOfSiteResponse } from "./models/tour-of-site-content.model";
import { TestBed } from "@angular/core/testing";
import { TourOfSite } from "./tour-of-site";
import { TourOfSiteService } from "./services/tour-of-site.service";
import { Subscription, of } from "rxjs";
import { IntroStep } from "intro.js/src/core/steps";
import { Options } from "intro.js/src/option";

describe('TourOfSite', () => {
    let tourOfSite: TourOfSite;
    let tourOfSiteServiceSpy;

    const tourOfSiteResponseNonMyVoyageMock = JSON.parse('{"tourContent":{"desktop":[{"id":"NAVIGATION","selector":"voya-global-nav","subContent":[{"id":"PRIMARY_NAVIGATION","selectorSource":"shadowRoot","selector":"v-primary-navigation","subContent":[{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":".v-primary-menu-holder","tooltipClass":"nav-tooltip"},{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":".profileIcon","tooltipPosition":"bottom-right-aligned"}]}]},{"id":"ACCOUNT_SNAPSHOTS","intro":"Stay up to date and view important account information or action items specific to different life events.","gaLabel":"","selector":".greeting"},{"id":"HERO_CARDS","intro":"View and track progress on your path to financial wellness along with guidance on your next best step.","gaLabel":"","selector":"#heroCarousel"},{"id":"ACCOUNT_COVERAGES","intro":"Get a historical view of your accounts and access all of them in one place.","gaLabel":"","selector":"app-accounts"},{"id":"BENEFITS_COVERAGES","intro":"See your elected employer provided coverages and access your historical medical spending details.","gaLabel":"","selector":"app-claim-coverages"}],"tablet":[{"id":"NAVIGATION","selector":"voya-global-nav","subContent":[{"id":"PRIMARY_NAVIGATION","selectorSource":"shadowRoot","selector":"v-primary-navigation","subContent":[{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":".v-primary-menu-holder","tooltipClass":"nav-tooltip"},{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":".profileIcon","tooltipPosition":"bottom-right-aligned"}]}]},{"id":"HERO_CARDS","intro":"View and track progress on your path to financial wellness along with guidance on your next best step.","gaLabel":"","selector":"#heroCarousel","tooltipPosition":"top"},{"id":"ACCOUNT_COVERAGES","intro":"Get a historical view of your accounts and access all of them in one place.","gaLabel":"","selector":"app-accounts-coverages","tooltipPosition":"top","tooltipClass":"accounts-coverages","action":{"event":"click","selector":"#accounts"}},{"id":"BENEFITS_COVERAGES","intro":"See your elected employer provided coverages and access your historical medical spending details.","gaLabel":"","selector":"app-accounts-coverages","tooltipPosition":"top","tooltipClass":"hide-initially benefits-coverages","action":{"event":"click","selector":"#claim-coverages"}},{"id":"ACCOUNT_SNAPSHOTS","intro":"Stay up to date and view important account information or action items specific to different life events.","gaLabel":"","selector":"#responsiveGreeting","tooltipPosition":"top"}],"mobile":[{"id":"NAVIGATION","selector":"voya-global-nav","subContent":[{"id":"MOBILE_NAVIGATION","selectorSource":"shadowRoot","selector":"v-mobile-navigation-container","subContent":[{"id":"MOBILE_NAVIGATION_TOP_BAR","selectorSource":"shadowRoot","selector":"v-mobile-navigation-topbar","subContent":[{"id":"HAMBURGER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":"v-hamburger"},{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":"v-hamburger","tooltipPosition":"bottom-right-aligned"}]}]}]},{"id":"HERO_CARDS","intro":"View and track progress on your path to financial wellness along with guidance on your next best step.","gaLabel":"","selector":"#heroCarousel","tooltipPosition":"top"},{"id":"ACCOUNT_COVERAGES","intro":"Get a historical view of your accounts and access all of them in one place.","gaLabel":"","selector":"app-accounts-coverages","tooltipPosition":"top","tooltipClass":"accounts-coverages","action":{"event":"click","selector":"#accounts"}},{"id":"BENEFITS_COVERAGES","intro":"See your elected employer provided coverages and access your historical medical spending details.","gaLabel":"","selector":"app-accounts-coverages","tooltipPosition":"top","tooltipClass":"hide-initially benefits-coverages","action":{"event":"click","selector":"#claim-coverages"}},{"id":"ACCOUNT_SNAPSHOTS","intro":"Stay up to date and view important account information or action items specific to different life events.","gaLabel":"","selector":"#responsiveGreeting","tooltipPosition":"top"}]}}') as TourOfSiteResponse;

    beforeEach(() => {
        tourOfSiteServiceSpy = jasmine.createSpyObj('tourOfSiteServiceSpy', ['getTourOfSiteData']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                TourOfSite,
                { provide: TourOfSiteService, useValue: tourOfSiteServiceSpy }
            ]
        });

        tourOfSite = TestBed.inject(TourOfSite);
        tourOfSite['subscription'] = jasmine.createSpyObj('Subscription', ['add', 'unsubscribe']);
        tourOfSite['resizeSubscription'] = jasmine.createSpyObj('ResizeSubscription', ['unsubscribe']);
        tourOfSite['introJS'] = jasmine.createSpyObj('introJs', ['setOptions', 'start', 'onbeforechange', 'onafterchange', 'onexit', 'onstart', 'exit', 'refresh']);
    });

    it('should be created', () => {
        expect(tourOfSite).toBeTruthy();
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe', () => {
            tourOfSite.ngOnDestroy();
            expect(tourOfSite['subscription'].unsubscribe).toHaveBeenCalled();
        });
    });

    describe('launch()', () => {
        it('should return Non My Voyage desktop tourContent', () => {
            const observable = of(tourOfSiteResponseNonMyVoyageMock);
            const subscription = new Subscription();
            spyOn(observable, 'subscribe').and.callFake(f => {
                f(tourOfSiteResponseNonMyVoyageMock);
                return subscription;
            })
            tourOfSiteServiceSpy.getTourOfSiteData.and.returnValue(observable);
            tourOfSite['startTourOfSite'] = jasmine.createSpy().and.callThrough();
            const mockWindow = {
                target: { innerWidth: 2000 },
                innerWidth: 2000
            };
            const mockWindowResize = of(mockWindow);
            const mockWindowResizeSpy = spyOn(mockWindowResize, 'subscribe');
            const getTourContentTypeSpy = spyOn(tourOfSite, 'getTourContentType');
            const fromEventSpy = spyOn(tourOfSite, 'fromEvent');
            fromEventSpy.and.callFake(() => {
                return mockWindowResize;
            });
            mockWindowResizeSpy.and.callThrough();
            getTourContentTypeSpy.and.returnValue('desktop');
            tourOfSite.launch();
            expect(tourOfSite['subscription'].add).toHaveBeenCalled();
            expect(tourOfSite['startTourOfSite']).toHaveBeenCalledWith(tourOfSiteResponseNonMyVoyageMock.tourContent['desktop'], 'desktop');
            expect(getTourContentTypeSpy).toHaveBeenCalledWith(2000);
        });

        it('should return Non My Voyage mobile tourContent', () => {
            const observable = of(tourOfSiteResponseNonMyVoyageMock);
            const subscription = new Subscription();
            spyOn(observable, 'subscribe').and.callFake(f => {
                f(tourOfSiteResponseNonMyVoyageMock);
                return subscription;
            })
            tourOfSiteServiceSpy.getTourOfSiteData.and.returnValue(observable);
            tourOfSite['startTourOfSite'] = jasmine.createSpy().and.callThrough();
            const mockWindow = {
                target: { innerWidth: 400 },
                innerWidth: 400
            };
            const mockWindowResize = of(mockWindow);
            const mockWindowResizeSpy = spyOn(mockWindowResize, 'subscribe');
            const getTourContentTypeSpy = spyOn(tourOfSite, 'getTourContentType');
            const fromEventSpy = spyOn(tourOfSite, 'fromEvent');
            fromEventSpy.and.callFake(() => {
                return mockWindowResize;
            });
            mockWindowResizeSpy.and.callThrough();
            getTourContentTypeSpy.and.returnValue('mobile');
            tourOfSite.launch();
            expect(tourOfSite['subscription'].add).toHaveBeenCalled();
            expect(tourOfSite['startTourOfSite']).toHaveBeenCalledWith(tourOfSiteResponseNonMyVoyageMock.tourContent['mobile'], 'mobile');
            expect(getTourContentTypeSpy).toHaveBeenCalledWith(400);
        });

        it('should NOT start tour when data is null', () => {
            const observable = of(null);
            const subscription = new Subscription();
            spyOn(observable, 'subscribe').and.callFake(f => {
                f(null);
                return subscription;
            })
            tourOfSiteServiceSpy.getTourOfSiteData.and.returnValue(observable);
            tourOfSite['startTourOfSite'] = jasmine.createSpy().and.callThrough();
            tourOfSite.launch();
            expect(tourOfSite['subscription'].add).toHaveBeenCalled();
            expect(tourOfSite['startTourOfSite']).not.toHaveBeenCalled();
        });

        it('should NOT start tour when data.tourContent is null', () => {
            const observable = of({ tourContent: null });
            const subscription = new Subscription();
            spyOn(observable, 'subscribe').and.callFake(f => {
                f({ tourContent: null });
                return subscription;
            })
            tourOfSiteServiceSpy.getTourOfSiteData.and.returnValue(observable);
            tourOfSite['startTourOfSite'] = jasmine.createSpy().and.callThrough();
            tourOfSite.launch();
            expect(tourOfSite['subscription'].add).toHaveBeenCalled();
            expect(tourOfSite['startTourOfSite']).not.toHaveBeenCalled();
        });
    });

    describe('startTourOfSite', () => {
        it('should call startTourOfSite', () => {
            tourOfSite['addSteps'] = jasmine.createSpy().and.callThrough();
            tourOfSite['onIntroJsBeforeChangeHandler'] = jasmine.createSpy().and.callThrough();
            tourOfSite['onIntroJsAfterChangeHandler'] = jasmine.createSpy().and.callThrough();
            tourOfSite['onIntroJsExitHandler'] = jasmine.createSpy().and.callThrough();
            tourOfSite['onIntroJsOnStartHandler'] = jasmine.createSpy().and.callThrough();
            tourOfSite['introJS'].onbeforechange = jasmine.createSpy().and.callFake(fn => { return fn(tourOfSite['introJS']); });
            tourOfSite['introJS'].onafterchange = jasmine.createSpy().and.callFake(fn => { return fn(tourOfSite['introJS']); });
            tourOfSite['introJS'].onexit = jasmine.createSpy().and.callFake(fn => { return fn(tourOfSite['introJS']); });
            tourOfSite['introJS'].onstart = jasmine.createSpy().and.callFake(fn => { return fn(tourOfSite['introJS']); });
            tourOfSite.startTourOfSite(tourOfSiteResponseNonMyVoyageMock.tourContent['desktop'], 'desktop');
            expect(tourOfSite['addSteps']).toHaveBeenCalledWith([], tourOfSiteResponseNonMyVoyageMock.tourContent['desktop']);
            const tourSteps: Partial<IntroStep>[] = [];
            const options: Partial<Options> = {
                steps: tourSteps,
                skipLabel: 'Close',
                showStepNumbers: false,
                hideNext: true,
                scrollTo: 'tooltip',
                scrollToElement: false,
                prevLabel:
                    '<div class="circle"><v-icon  primary name="fas fa-chevron-left" size="24px"></v-icon></div>',
                nextLabel:
                    '<div class="circle"><v-icon  primary name="chevronright" size="24px"></v-icon></div>',
            };
            expect(tourOfSite['introJS'].setOptions).toHaveBeenCalledWith(options);
            expect(tourOfSite['introJS'].start).toHaveBeenCalled();
            expect(tourOfSite['introJS'].onbeforechange).toHaveBeenCalled();
            expect(tourOfSite['introJS'].onafterchange).toHaveBeenCalled();
            expect(tourOfSite['introJS'].onexit).toHaveBeenCalled();
            expect(tourOfSite['introJS'].onstart).toHaveBeenCalled();
            expect(tourOfSite['onIntroJsBeforeChangeHandler']).toHaveBeenCalledWith('desktop');
            expect(tourOfSite['onIntroJsAfterChangeHandler']).toHaveBeenCalled();
            expect(tourOfSite['onIntroJsExitHandler']).toHaveBeenCalled();
            expect(tourOfSite['onIntroJsOnStartHandler']).toHaveBeenCalled();
        });
    });

    describe('addSteps', () => {
        it('should NOT execute addSteps when stepItems is null', () => {
            tourOfSite['addStepItem'] = jasmine.createSpy().and.callThrough();
            tourOfSite.addSteps([], null);
            expect(tourOfSite['addStepItem']).not.toHaveBeenCalled();
        });

        it('should NOT execute addSteps when stepItems is undefined', () => {
            tourOfSite['addStepItem'] = jasmine.createSpy().and.callThrough();
            tourOfSite.addSteps([], undefined);
            expect(tourOfSite['addStepItem']).not.toHaveBeenCalled();
        });

        it('should execute addSteps for default queryselector', () => {
            tourOfSite['addStepItem'] = jasmine.createSpy().and.callThrough();
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            const tourOfSiteContentItemsMock = JSON.parse('[{ "id": "HERO_CARDS", "intro": "View and track progress on your path to financial wellness along with guidance on your next best step.", "gaLabel": "", "selector": "#heroCarousel" }]') as TourOfSiteContentItem[];
            const tourSteps: Partial<IntroStep>[] = [];
            tourOfSite.addSteps(tourSteps, tourOfSiteContentItemsMock);
            expect(tourOfSite.addStepItem).toHaveBeenCalledWith(tourSteps, tourOfSiteContentItemsMock[0], tourOfSite['document'].querySelector('#heroCarousel') as HTMLElement);
            expect(tourOfSite['document'].querySelector).toHaveBeenCalledWith('#heroCarousel');
        });

        it('should execute addSteps for child queryselector, with NON shadowRoot selector', () => {
            tourOfSite['addStepItem'] = jasmine.createSpy().and.callThrough();
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            const elementMock = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.callThrough()
                },
                querySelector: jasmine.createSpy().and.callThrough()
            } as unknown as HTMLElement;
            const tourOfSiteContentItemsMock = JSON.parse('[{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selector":".v-primary-menu-holder"}]') as TourOfSiteContentItem[];
            const tourSteps: Partial<IntroStep>[] = [];
            tourOfSite.addSteps(tourSteps, tourOfSiteContentItemsMock, elementMock);
            expect(tourOfSite.addStepItem).toHaveBeenCalledWith(tourSteps, tourOfSiteContentItemsMock[0], elementMock.querySelector('.v-primary-menu-holder') as HTMLElement);
            expect(elementMock.querySelector).toHaveBeenCalledWith('.v-primary-menu-holder');
        });

        it('should execute addSteps for child queryselector, with shadowRoot selector', () => {
            tourOfSite['addStepItem'] = jasmine.createSpy().and.callThrough();
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            const elementMock = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.callThrough()
                },
                querySelector: jasmine.createSpy().and.callThrough()
            } as unknown as HTMLElement;
            const tourOfSiteContentItemsMock = JSON.parse('[{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":".profileIcon"}]') as TourOfSiteContentItem[];
            const tourSteps: Partial<IntroStep>[] = [];
            tourOfSite.addSteps(tourSteps, tourOfSiteContentItemsMock, elementMock);
            expect(tourOfSite.addStepItem).toHaveBeenCalledWith(tourSteps, tourOfSiteContentItemsMock[0], elementMock.shadowRoot.querySelector('.profileIcon') as HTMLElement);
            expect(elementMock.shadowRoot.querySelector).toHaveBeenCalledWith('.profileIcon');
        });
    });

    describe('addStepItem', () => {
        it('should add steps with children to array', () => {
            const tourOfSiteContentItemMock = JSON.parse('{"id":"NAVIGATION","selector":"voya-global-nav","subContent":[{"id":"PRIMARY_NAVIGATION","selector":"v-primary-navigation","subContent":[{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":".v-primary-menu-holder","tooltipClass": "nav-tooltip"},{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selector":".profileIcon"},{"id":"PERSONAL_INFO_2","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":".profileIcon","tooltipPosition": "bottom-right-aligned"},{"id":"ACCOUNT_COVERAGES","intro":"Get a historical view of your accounts and access all of them in one place.","gaLabel":"","selector":"app-accounts-coverages","tooltipPosition":"top","tooltipClass":"accounts-coverages","action":{"event":"click","selector":"#accounts"}}]}]}') as TourOfSiteContentItem;
            const tourSteps: Partial<IntroStep>[] = [];
            const node_level_04 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.callThrough()
                },
                querySelector: jasmine.createSpy().and.callThrough()
            } as unknown as HTMLElement;
            const node_level_03 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.returnValue(node_level_04),
                    children: [node_level_04, node_level_04]
                },
                querySelector: jasmine.createSpy().and.returnValue(node_level_04),
                children: [node_level_04, node_level_04]
            } as unknown as HTMLElement;
            const node_level_02 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.returnValue(node_level_03)
                },
                querySelector: jasmine.createSpy().and.returnValue(node_level_03)
            } as unknown as HTMLElement;
            const node_level_01 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.returnValue(node_level_02)
                },
                querySelector: jasmine.createSpy().and.returnValue(node_level_02)
            } as unknown as HTMLElement;
            tourOfSite.addStepItem(tourSteps, tourOfSiteContentItemMock, node_level_01);
            expect(tourSteps.length).toEqual(4);
            expect(tourSteps[0].intro).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[0].intro);
            expect(tourSteps[0].tooltipClass).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[0].tooltipClass);
            expect(tourSteps[1].intro).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[1].intro);
            expect(tourSteps[2].intro).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[2].intro);
            expect(tourSteps[2].position).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[2].tooltipPosition);
            expect(tourSteps[3].intro).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[3].intro);
            expect(tourSteps[3]["action"]).toEqual(tourOfSiteContentItemMock.subContent[0].subContent[3].action);
        });

        it('should NOT add step when parent node is empty', () => {
            const tourOfSiteContentItemMock = JSON.parse('{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selector":".v-primary-menu-holder","tooltipClass": "nav-tooltip"}') as TourOfSiteContentItem;
            const tourSteps: Partial<IntroStep>[] = [];
            tourOfSite.addStepItem(tourSteps, tourOfSiteContentItemMock, undefined);
            expect(tourSteps.length).toEqual(0);
        });

        it('should NOT add step when innerHtml/children is empty', () => {
            const tourOfSiteContentItemMock = JSON.parse('{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selector":".v-primary-menu-holder","tooltipClass": "nav-tooltip"}') as TourOfSiteContentItem;
            const tourSteps: Partial<IntroStep>[] = [];
            const node_level_02 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.callThrough()
                },
                querySelector: jasmine.createSpy().and.callThrough()
            }
            const node_level_01 = {
                querySelector: jasmine.createSpy().and.returnValue(node_level_02)
            } as unknown as HTMLElement;
            tourOfSite.addStepItem(tourSteps, tourOfSiteContentItemMock, node_level_01);
            expect(tourSteps.length).toEqual(0);
        });

        it('should NOT add step when innerHtml/children shadowRoot is empty', () => {
            const tourOfSiteContentItemMock = JSON.parse('{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":".v-primary-menu-holder","tooltipClass": "nav-tooltip"}') as TourOfSiteContentItem;
            const tourSteps: Partial<IntroStep>[] = [];
            const node_level_02 = {
                shadowRoot: {
                    querySelector: jasmine.createSpy().and.callThrough()
                },
                querySelector: jasmine.createSpy().and.callThrough()
            }
            const node_level_01 = {
                querySelector: jasmine.createSpy().and.returnValue(node_level_02)
            } as unknown as HTMLElement;
            tourOfSite.addStepItem(tourSteps, tourOfSiteContentItemMock, node_level_01);
            expect(tourSteps.length).toEqual(0);
        });
    });

    describe('stop()', () => {
        it('should call introjs exit to stop tour', () => {
            document.querySelector('body').classList.add('tour-active');
            tourOfSite['document'] = document;
            tourOfSite.stop();
            expect(tourOfSite['introJS'].exit).toHaveBeenCalledWith(true);
            document.querySelector('body').classList.remove('tour-active');
        });

        it('should NOT call introjs exit to stop tour', () => {
            tourOfSite['document'] = document;
            tourOfSite.stop();
            expect(tourOfSite['introJS'].exit).not.toHaveBeenCalled();
        });
    });

    describe('onIntroJsBeforeChangeHandler()', () => {
        const elementMock = {
            click: jasmine.createSpy().and.callThrough()
        } as unknown as HTMLElement;

        beforeEach(() => {
            const tourSteps: Partial<IntroStep>[] = [
                { intro: "test1" },
                { intro: "test2" },
                { intro: "test3" },
                { intro: "test4" }
            ];
            tourSteps[2]["action"] = { event: "click", selector: "#someElement1" }
            tourSteps[3]["action"] = { event: "onchange", selector: "#someElement2" }
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(elementMock);
            tourOfSite['introJS']['_introItems'] = tourSteps as IntroStep[];
            tourOfSite['w'] = jasmine.createSpyObj(window, ['scrollTo']);
            tourOfSite['w'].scrollTo = jasmine.createSpy().and.callThrough();
        });

        it('should NOT set for desktop', () => {
            tourOfSite['introJS']['_currentStep'] = 2;
            tourOfSite.onIntroJsBeforeChangeHandler('desktop');
            expect(tourOfSite['introJS'].refresh).not.toHaveBeenCalled();
        });

        it('should set for tablet, with action click', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 2;
            tourOfSite['introJS']['_direction'] = 'backward';
            tourOfSite.onIntroJsBeforeChangeHandler('tablet');

            expect(elementMock.click).toHaveBeenCalled();

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).toHaveBeenCalledWith(0, 0);
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();
            
            jasmine.clock().uninstall();
        });

        it('should set for tablet, NO or null element found', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 2;
            tourOfSite['introJS']['_direction'] = 'backward';
            tourOfSite.onIntroJsBeforeChangeHandler('tablet');
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(null);

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).toHaveBeenCalledWith(0, 0);
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it('should set for tablet, NO or undefine element found', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 2;
            tourOfSite['introJS']['_direction'] = 'backward';
            tourOfSite.onIntroJsBeforeChangeHandler('tablet');
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(undefined);

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).toHaveBeenCalledWith(0, 0);
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it('should set for tablet, with action onchange', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 3;
            tourOfSite['introJS']['_direction'] = 'forward';
            tourOfSite.onIntroJsBeforeChangeHandler('tablet');

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).not.toHaveBeenCalled();
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it('should set for tablet, with NO action', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 1;
            tourOfSite['introJS']['_direction'] = 'forward';
            tourOfSite.onIntroJsBeforeChangeHandler('tablet');

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).not.toHaveBeenCalled();
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it('should set for mobile, with action click', () => {
            jasmine.clock().install();

            tourOfSite['introJS']['_currentStep'] = 2;
            tourOfSite['introJS']['_direction'] = 'backward';
            tourOfSite.onIntroJsBeforeChangeHandler('mobile');

            expect(elementMock.click).toHaveBeenCalled();

            jasmine.clock().tick(100);
            expect(tourOfSite['w'].scrollTo).toHaveBeenCalledWith(0, 0);
            expect(tourOfSite['introJS'].refresh).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });
    });

    describe('onIntroJsAfterChangeHandler()', () => {
        it('should call onIntroJsAfterChangeHandler()', () => {
            const elementMock = {
                classList: {
                    remove: jasmine.createSpy().and.callThrough()
                }
            } as unknown as HTMLElement;
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(elementMock);

            jasmine.clock().install();

            tourOfSite.onIntroJsAfterChangeHandler();

            jasmine.clock().tick(600);
            expect(elementMock.classList.remove).toHaveBeenCalledWith('hide-initially');

            jasmine.clock().uninstall();
        });
    });

    describe('onIntroJsExitHandler()', () => {
        it('should call onIntroJsExitHandler()', () => {
            const elementMock = {
                classList: {
                    remove: jasmine.createSpy().and.callThrough()
                }
            } as unknown as HTMLElement;
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(elementMock);

            tourOfSite.onIntroJsExitHandler();

            expect(elementMock.classList.remove).toHaveBeenCalledWith('tour-active');
            expect(tourOfSite['resizeSubscription'].unsubscribe).toHaveBeenCalled();
        });
    });

    describe('onIntroJsOnStartHandler()', () => {
        it('should call onIntroJsOnStartHandler()', () => {
            const elementMock = {
                classList: {
                    add: jasmine.createSpy().and.callThrough()
                }
            } as unknown as HTMLElement;
            tourOfSite['document'] = jasmine.createSpyObj(document, ['querySelector']);
            tourOfSite['document'].querySelector = jasmine.createSpy().and.returnValue(elementMock);

            tourOfSite.onIntroJsOnStartHandler();

            expect(elementMock.classList.add).toHaveBeenCalledWith('tour-active');
        });
    });

    describe('getTourContentType()', () => {
        beforeEach(() => {
            tourOfSite["stop"] = jasmine.createSpy().and.callThrough();
        });

        it('should return desktop', () => {
            expect(tourOfSite.getTourContentType(2000)).toEqual('desktop');
            expect(tourOfSite["stop"]).not.toHaveBeenCalled();
        });

        it('should return tablet', () => {
            tourOfSite.tourContentType = 'desktop';
            expect(tourOfSite.getTourContentType(1024)).toEqual('tablet');
            expect(tourOfSite["stop"]).toHaveBeenCalled();
        });

        it('should return mobile', () => {
            tourOfSite.tourContentType = 'desktop';
            expect(tourOfSite.getTourContentType(400)).toEqual('mobile');
            expect(tourOfSite["stop"]).toHaveBeenCalled();
        });
    });
});