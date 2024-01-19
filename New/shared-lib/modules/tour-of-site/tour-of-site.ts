import {Injectable, OnDestroy} from '@angular/core';
import {TourOfSiteService} from './services/tour-of-site.service';
import {Observable, Subscription, fromEvent} from 'rxjs';
import * as introJs from 'intro.js';
import { ActionEvent, TourContentType, TourOfSiteContentItem} from './models/tour-of-site-content.model';
import {IntroStep, TooltipPosition} from 'intro.js/src/core/steps';

@Injectable({
  providedIn: 'root',
})
export class TourOfSite implements OnDestroy {
  private subscription: Subscription = new Subscription();
  introJS = introJs.default();
  document = document;
  w = window;
  fromEvent = fromEvent;
  resizeObservable: Observable<Event>
  resizeSubscription: Subscription;
  tourContentType: TourContentType = 'desktop';

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  constructor(private tourOfSiteService: TourOfSiteService) {}

  launch(): void {
    this.tourContentType = this.getTourContentType(this.w.innerWidth);
    this.resizeObservable = this.fromEvent(this.w, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
        const innerWidth = evt.target["innerWidth"];
        this.tourContentType = this.getTourContentType(innerWidth);
    })

    this.subscription.add(
      this.tourOfSiteService.getTourOfSiteData().subscribe(data => {
        if (data?.tourContent) {
          this.startTourOfSite(data.tourContent[this.tourContentType], this.tourContentType);
        }
      })
    );
  }

  startTourOfSite(
    contentItems: TourOfSiteContentItem[],
    type: TourContentType
  ): void {
    const tourSteps: Partial<IntroStep>[] = [];
    this.addSteps(tourSteps, contentItems);
    this.introJS.setOptions({
      steps: tourSteps,
      skipLabel: 'Close',
      showStepNumbers: false,
      hideNext: true,
      scrollTo: 'tooltip',
      scrollToElement: type !== 'desktop',
      prevLabel:
        '<div class="circle"><v-icon  primary name="fas fa-chevron-left" size="24px"></v-icon></div>',
      nextLabel:
        '<div class="circle"><v-icon  primary name="chevronright" size="24px"></v-icon></div>',
    });
      this.introJS.onbeforechange(() => {
          this.onIntroJsBeforeChangeHandler(type);
          return true;
      });
      this.introJS.onafterchange(() => {
          this.onIntroJsAfterChangeHandler();
      });
      this.introJS.onexit(() => {
          this.onIntroJsExitHandler();
      });
      this.introJS.onstart(() => {
          this.onIntroJsOnStartHandler();
      });
    this.introJS.start();
  }

  addSteps(
    steps: Partial<IntroStep>[],
    stepItems: TourOfSiteContentItem[],
    node?: HTMLElement
  ): void {
    stepItems?.forEach((s: TourOfSiteContentItem) => {
      const elementNode = node
        ? this.getChildElement(s, node)
        : this.document.querySelector(s.selector);
      this.addStepItem(steps, s, elementNode as HTMLElement);
    });
  }

  addStepItem(
    steps: Partial<IntroStep>[],
    item: TourOfSiteContentItem,
    node: HTMLElement
  ): void {
    //check if node is available, before adding to the steps
      if (node) {
        //check if step content, has children before adding to the steps
        if (this.isValidStep(item, node)) {
            const step = { element: node, intro: item.intro } as Partial<IntroStep>;
            if (item.tooltipClass) step['tooltipClass'] = item.tooltipClass;
            if (item.tooltipPosition)
                step.position = item.tooltipPosition as TooltipPosition;
            if (item.action)
                step["action"] = item.action;
            steps.push(step);
        }
        if (item.subContent?.length > 0)
            this.addSteps(steps, item.subContent, node);
    }
  }

  private isValidStep(item: TourOfSiteContentItem,
                      node: HTMLElement): boolean {
      const isValidIntroText = (item.intro != null && item.intro != undefined);
      const isValidComponent = (node.shadowRoot != null && node.shadowRoot != undefined);
      return (isValidIntroText && (node.children?.length > 0 || isValidComponent));
  }

  private getChildElement(
    s: TourOfSiteContentItem,
    node: HTMLElement
  ): Element {
    return s.selectorSource === 'shadowRoot'
      ? node.shadowRoot.querySelector(s.selector)
      : node.querySelector(s.selector);
  }

    stop(): void {
        //stop only when tour is active
        const isTourActive = this.document.querySelector("body").classList.contains("tour-active");
        if (isTourActive)
            this.introJS.exit(true);
    }

    onIntroJsBeforeChangeHandler(type: TourContentType): void {
        const e = this.introJS;
        if (type !== "desktop") {
            const currentStep = e._introItems[e._currentStep];
            if (currentStep["action"]) {
                const actionItem = currentStep["action"] as ActionEvent;
                if (actionItem.event === 'click') {
                    const elem = this.document.querySelector(actionItem.selector);
                    if (elem)
                        (elem as HTMLElement).click();
                }
            }
            setTimeout(() => {
                if (e._direction === 'backward')
                    this.w.scrollTo(0, 0);
                e.refresh();
            }, 100);
        }
    }

    onIntroJsAfterChangeHandler(): void {
        setTimeout(() => {
            this.document.querySelector('.introjs-tooltip').classList.remove('hide-initially');
        }, 600);
    }

    onIntroJsExitHandler(): void {
        this.document.querySelector("body").classList.remove("tour-active");
        this.resizeSubscription.unsubscribe();
    }

    onIntroJsOnStartHandler(): void {
        this.document.querySelector("body").classList.add("tour-active");
    }

    getTourContentType(innerWidth: number): TourContentType {
        let finalTourContentType;
        if (innerWidth <= 842)
            finalTourContentType = 'mobile';
        else if (innerWidth <= 1193)
            finalTourContentType = 'tablet'
        else
            finalTourContentType = 'desktop'

        //if there are changes on the content type, stop the tour to force recalc of page elements
        //since page elements are different between desktop, tablet and mobile
        //always force close for mobile
        if (finalTourContentType !== this.tourContentType || finalTourContentType === 'mobile')
            this.stop();

        return finalTourContentType;
    }
}
