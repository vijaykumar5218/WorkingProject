import {Injectable, Injector} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {from, Observable, ReplaySubject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {endpoints} from './constants/endpoints';
import {ModalComponent} from '@shared-lib/modules/journeys/components/modal/modal.component';
import {
  Journey,
  JourneyResponse,
  JourneyStep,
  StepContentResponse,
  Option,
  StepContentElement,
  TableInputValue,
  JourneyStatus,
  StepContentElements,
  FilteredRecords,
} from './models/journey.model';
import * as journeyContent from './constants/journey-content.json';
import {JourneyContent} from './models/journeyContent.model';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {Status} from '../../constants/status.enum';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import {injectionTokenMap} from './constants/injectionTokens';
import {ValidationType} from './constants/validationType.enum';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private endpoints;
  private subscription: Subscription = new Subscription();
  private stepContentSubject: ReplaySubject<Record<string, string>> = null;
  private journeyResponseSubject: ReplaySubject<JourneyResponse>;
  private currentStepSubject = new ReplaySubject<number>(1);
  content: JourneyContent = (journeyContent as any).default;
  private selectedTab$: ReplaySubject<string> = new ReplaySubject<string>(1);
  private journeyResponse: JourneyResponse;
  currentJourney: Journey;
  journeyServiceMap: Record<number, any> = {};
  private journeyBackButton: string;
  private journeyAddAccount: string;
  private statusOrder = [
    Status.inProgress,
    Status.notStarted,
    Status.completed,
  ];
  private journeyRefreshMxAccount: string;
  private leaveJourneyPublisher: Publisher;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private modalController: ModalController,
    private inAppBrowser: InAppBroserService,
    private injector: Injector,
    private previewAnyFile: PreviewAnyFile,
    private eventManagerService: EventManagerService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
    this.refreshJourneys();
    this.leaveJourneyPublisher = this.eventManagerService.createPublisher(
      eventKeys.leaveJourney
    );
  }

  fetchJourneys(refresh = false): Observable<JourneyResponse> {
    if (this.journeyResponseSubject == null || refresh) {
      if (this.journeyResponseSubject == null) {
        this.journeyResponseSubject = new ReplaySubject<JourneyResponse>(1);
      }

      const journeyResponse = from(
        this.baseService.get(this.endpoints.getJourneys)
      ).pipe(
        map((journeyRes: JourneyResponse) => {
          this.parseContent(journeyRes);
          journeyRes.recommended = this.getRecommendedJourneys(
            journeyRes.recommended
          );
          this.journeyResponse = journeyRes;
          return journeyRes;
        })
      );

      this.subscription.add(
        journeyResponse.subscribe((journeyRes: JourneyResponse) => {
          this.journeyResponseSubject.next(journeyRes);
        })
      );
    }
    return this.journeyResponseSubject;
  }

  private refreshJourneys() {
    this.subscription.add(
      this.utilityService.getPlatformResume().subscribe(() => {
        this.fetchJourneys(true);
      })
    );
  }

  updateJourneySteps(
    steps: JourneyStep[],
    journeyId: number,
    callStepChange = true
  ) {
    if (this.journeyResponse) {
      this.updateJourneyListWithSteps(
        steps,
        journeyId,
        this.journeyResponse.all
      );
      this.updateJourneyListWithSteps(
        steps,
        journeyId,
        this.journeyResponse.recommended
      );
      this.journeyResponse.recommended = this.getRecommendedJourneys(
        this.journeyResponse.recommended
      );
    }
    if (
      this.journeyServiceMap[journeyId] &&
      this.journeyServiceMap[journeyId].stepChange &&
      callStepChange
    ) {
      this.journeyServiceMap[journeyId].stepChange(this.getCurrentJourney());
    }
    this.journeyResponseSubject?.next(this.journeyResponse);
  }

  private updateJourneyListWithSteps(
    steps: JourneyStep[],
    journeyId: number,
    list: Journey[]
  ) {
    if (list) {
      const currentJourney = list.find(
        journey => journey.journeyID === journeyId
      );
      if (currentJourney) {
        currentJourney.steps = steps;
        this.setCurrentJourney(currentJourney);
      }
    }
  }

  private parseContent(journeyResponse: JourneyResponse): void {
    if (journeyResponse) {
      this.parseJourneyListContent(journeyResponse.all);
      this.parseJourneyListContent(journeyResponse.recommended);
      this.sortJourneys(journeyResponse.all);
      this.sortJourneys(journeyResponse.recommended);
    }
  }

  private sortJourneys(journeys: Journey[]) {
    journeys.sort((a, b) => {
      const comingSoonA = this.isComingSoon(a);
      const comingSoonB = this.isComingSoon(b);

      let returnVal;
      if (comingSoonA && comingSoonB) {
        returnVal = 0;
      } else if (comingSoonA) {
        returnVal = 1;
      } else if (comingSoonB) {
        returnVal = -1;
      } else {
        const statusOrderA = this.statusOrder.indexOf(
          this.getJourneyStatus(a.steps)
        );
        const statusOrderB = this.statusOrder.indexOf(
          this.getJourneyStatus(b.steps)
        );
        if (statusOrderA === statusOrderB) {
          returnVal = 0;
        } else if (statusOrderA < statusOrderB) {
          returnVal = -1;
        } else {
          returnVal = 1;
        }
      }
      return returnVal;
    });
  }

  private parseJourneyListContent(journeys: Journey[]): void {
    if (journeys) {
      journeys.forEach(
        (journey: Journey): Journey => {
          journey.parsedLandingAndOverviewContent = journey.landingAndOverviewContent
            ? JSON.parse(journey.landingAndOverviewContent)
            : null;
          journey.parsedResourcesContent = journey.resourcesContent
            ? JSON.parse(journey.resourcesContent)
            : null;
          journey.parsedComingSoonContent = journey.comingSoonContent
            ? JSON.parse(journey.comingSoonContent)
            : null;
          return journey;
        }
      );
    }
  }

  isRecommendedJourney(journey: Journey): boolean {
    let result = false;
    this.journeyResponse.recommended.every(j => {
      if (journey.journeyID == j.journeyID) {
        result = true;
        return false;
      }
    });

    return result;
  }

  getRecommendedJourneys(journeys: Journey[]): Journey[] {
    const recommendedJourneys = [];
    journeys?.forEach(journey => {
      if (this.getJourneyStatus(journey.steps) !== Status.completed) {
        recommendedJourneys.push(journey);
      }
    });
    return recommendedJourneys;
  }

  setCurrentJourney(journey: Journey, updateResponse = false) {
    const previousJourney = this.getCurrentJourney();
    if (journey !== previousJourney) {
      this.resetStepContent();
      localStorage.setItem('currentJourney', JSON.stringify(journey));
      this.currentJourney = journey;
      if (updateResponse) {
        const allIndex = this.journeyResponse.all.findIndex(
          j => j.journeyID === journey.journeyID
        );
        this.journeyResponse.all[allIndex] = journey;
        const recommendedIndex = this.journeyResponse?.recommended.findIndex(
          j => j.journeyID === journey.journeyID
        );
        if (recommendedIndex || recommendedIndex === 0) {
          this.journeyResponse.recommended[recommendedIndex] = journey;
        }
        this.journeyResponseSubject.next(this.journeyResponse);
      }
    }
  }

  getCurrentJourney(): Journey {
    const currentJourney = localStorage.getItem('currentJourney');
    return currentJourney !== 'undefined' && currentJourney
      ? JSON.parse(currentJourney)
      : this.currentJourney;
  }

  saveProgress(stepStatuses: JourneyStep[]): Promise<void> {
    const currentJourney = this.getCurrentJourney();
    const stepStatusesCopy = JSON.parse(JSON.stringify(stepStatuses));
    if (this.journeyServiceMap[currentJourney.journeyID]?.processForSave) {
      this.journeyServiceMap[currentJourney.journeyID].processForSave(
        stepStatusesCopy
      );
    }
    return this.baseService.post(
      this.endpoints.saveStepProgress,
      stepStatusesCopy
    );
  }

  fetchStepContent(
    journeyStepTagId: string,
    msgType: string
  ): Observable<StepContentResponse> {
    if (this.stepContentSubject == null) {
      this.stepContentSubject = new ReplaySubject(1);
      const subscription = from(
        this.baseService.get(this.endpoints.getStepContent + msgType)
      ).subscribe(this.stepContentSubject);
      this.subscription.add(subscription);
    }
    return this.stepContentSubject.pipe(
      map(
        (content: Record<string, string>): StepContentResponse => {
          let stepContentResponse: StepContentResponse;
          if (content[journeyStepTagId]) {
            stepContentResponse = JSON.parse(content[journeyStepTagId]);
          }
          return stepContentResponse;
        }
      )
    );
  }

  resetStepContent() {
    this.stepContentSubject = null;
  }

  publishCurrentStep(step: number) {
    this.currentStepSubject.next(step);
  }

  getCurrentStep$(): Observable<number> {
    return this.currentStepSubject;
  }

  openMxAccModal() {
    const prop = {
      id: 'contentModal',
      elements: [
        {
          id: 'manageMXaccount',
          header: 'Add Account',
        },
      ],
    };

    return this.openModal({
      element: prop,
    });
  }

  async openModal(componentProps: any, fullscreen = true) {
    if (componentProps.element?.fullscreen !== undefined) {
      fullscreen = componentProps.element.fullscreen;
    }
    componentProps.fullscreen = fullscreen;
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: componentProps,
      cssClass: fullscreen ? 'modal-fullscreen' : 'modal-not-fullscreen',
    });
    return modal.present();
  }

  openWebView(link: string, header?: string, toolbar?: boolean) {
    if (this.utilityService.getIsWeb()) {
      window.open(link, '_blank');
    } else {
      if (link.includes('.pdf')) {
        this.previewAnyFile.preview(link);
      } else {
        const voyaController = new VoyaIABController();
        voyaController.headerText = header;
        if (toolbar) {
          voyaController.browserOptions.toolbar = 'yes';
        }
        this.inAppBrowser.openInAppBrowser(link, voyaController);
      }
    }
  }

  safeParse(
    str: string | string[]
  ):
    | Record<string, string | boolean>
    | Option[]
    | TableInputValue[]
    | Record<string, string>[] {
    let parsedResult;
    try {
      if (typeof str === 'string') {
        parsedResult = JSON.parse(str);
      } else {
        if (str !== undefined) {
          parsedResult = [];
          str.forEach(string => {
            parsedResult.push(JSON.parse(string));
          });
        }
      }
    } catch (error) {
      if (str) {
        console.error(error);
      }
    }
    return parsedResult;
  }

  findElementByProp(
    content: StepContentResponse,
    prop: string,
    value: string
  ): StepContentElement {
    let stepContentElement;
    for (const pageElement of content.pageElements) {
      if (stepContentElement) {
        break;
      }
      const elements = pageElement.elements;
      for (const element of elements) {
        if (element[prop] === value) {
          stepContentElement = element;
          break;
        }
      }
    }

    return stepContentElement;
  }

  isSummaryStepCompleted(): boolean {
    const journey = this.getCurrentJourney();
    let summaryStepCompleted = false;
    if (journey.parsedLandingAndOverviewContent.overview.requiredSteps) {
      summaryStepCompleted = this.checkRequiredStepStatus(journey);
    } else {
      journey.parsedLandingAndOverviewContent.overview.summarySteps.forEach(
        summaryStep => {
          if (
            journey.steps.find(
              step =>
                summaryStep.journeyStepName === step.journeyStepName &&
                step.status === Status.completed
            )
          ) {
            summaryStepCompleted = true;
          }
        }
      );
    }

    return summaryStepCompleted;
  }

  private checkRequiredStepStatus(journey: Journey): boolean {
    let requiredCompleted = true;
    journey.parsedLandingAndOverviewContent.overview.requiredSteps.forEach(
      summaryStepName => {
        const step = journey.steps.find(
          journeyStep => journeyStep.journeyStepName === summaryStepName
        );
        if (step?.status !== Status.completed) {
          requiredCompleted = false;
        }
      }
    );
    return requiredCompleted;
  }

  async setStepContent(journey: Journey): Promise<void> {
    return new Promise<void>(r => {
      journey.steps.forEach(async (step, i) => {
        if (step.journeyStepCMSTagId) {
          this.subscription.add(
            this.fetchStepContent(
              step.journeyStepCMSTagId,
              step.msgType
            ).subscribe(async (content: StepContentResponse) => {
              step.content = content;
              this.setIdSufixes(step.content, i);
              if (i === journey.steps.length - 1) {
                await this.initializeServices(journey);
                r();
              }
            })
          );
        }
      });
    });
  }

  setIdSufixes(content: StepContentResponse, index: number) {
    if (content) {
      content.pageElements.forEach(
        (elements: StepContentElements, pageElementIndex: number) => {
          elements.elements.forEach(
            (el: StepContentElement, elementIndex: number) => {
              if ('id' in el) {
                el.idSuffix = '' + pageElementIndex + elementIndex + index;
              } else if ('pageElements' in el) {
                el.pageElements.forEach(
                  (pageEle: StepContentElements, pageEleIndex: number) => {
                    pageEle.elements.forEach(
                      (ele: StepContentElement, eleIndex: number) => {
                        ele.idSuffix =
                          '' +
                          pageElementIndex +
                          elementIndex +
                          pageEleIndex +
                          eleIndex +
                          index;
                      }
                    );
                  }
                );
              }
            }
          );
        }
      );

      content.helpCards?.forEach(
        (helpCard: StepContentElement, helpIndex: number) => {
          helpCard.idSuffix = '' + helpIndex + index;
        }
      );
    }
  }

  async initializeServices(journey: Journey): Promise<void> {
    if (journey.parsedLandingAndOverviewContent.service) {
      const service = this.injector.get<any>(
        injectionTokenMap[journey.parsedLandingAndOverviewContent.service]
      );
      await service.initialize(journey);
      this.journeyServiceMap[journey.journeyID] = service;
    }
  }

  getJourneyStatus(steps: JourneyStep[]): Status {
    let status = Status.notStarted;
    const isInProgress = steps?.some(
      (step: JourneyStep): boolean => !!step.status
    );
    const isCompleted = steps?.every(
      (step: JourneyStep): boolean => step.status === Status.completed
    );
    if (isCompleted) {
      status = Status.completed;
    } else if (isInProgress) {
      status = Status.inProgress;
    }
    return status;
  }

  getSelectedTab$(): ReplaySubject<string> {
    return this.selectedTab$;
  }

  publishSelectedTab(selectedTab: string) {
    this.selectedTab$.next(selectedTab);
  }

  isValueEmpty(value: string | number | string[]): boolean {
    if (typeof value === 'string') {
      return !value || value === '$';
    } else {
      return !value && value !== 0;
    }
  }

  fetchTabs(tabsLink: Array<string>, queryParam?: string): SubHeaderTab[] {
    const tabs = [];
    for (const link of tabsLink) {
      tabs.push({
        label: this.content.tabHeader[link + 'Label'],
        link: queryParam ? link + queryParam : link,
      });
    }
    return tabs;
  }

  addDollar(value: string, element: StepContentElement): string {
    return element.validationRules.type === ValidationType.dollar
      ? '$' + value
      : value;
  }

  removeDollar(value: string, element: StepContentElement): string {
    return element.validationRules.type === ValidationType.dollar &&
      value?.includes('$')
      ? value.slice(1)
      : value;
  }

  isComingSoon(journey: Journey): boolean {
    let comingSoon = false;
    const isWeb = this.utilityService.getIsWeb();
    if (journey.parsedLandingAndOverviewContent && journey.comingSoonContent) {
      if (isWeb) {
        comingSoon = true;
      }
    } else if (journey.comingSoonContent) {
      comingSoon = true;
    }
    return comingSoon;
  }

  setJourneyBackButton(link: string) {
    this.journeyBackButton = link;
    localStorage.setItem('journeyBackButton', link);
  }

  getJourneyBackButton(): string {
    const localStorageLink = localStorage.getItem('journeyBackButton');
    return localStorageLink && localStorageLink !== 'undefined'
      ? localStorageLink
      : this.journeyBackButton;
  }

  getJourneyCompletionStatus(): Promise<JourneyStatus> {
    return this.baseService.get(this.endpoints.completionStatus);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setAddAccount(flag: string) {
    this.journeyAddAccount = flag;
    localStorage.setItem('addAccount', flag);
  }

  getAddAccount(): string {
    const localStorageFlag = localStorage.getItem('addAccount');
    return localStorageFlag && localStorageFlag !== 'undefined'
      ? localStorageFlag
      : this.journeyAddAccount;
  }

  setRefreshMxAccount(flag: string) {
    this.journeyRefreshMxAccount = flag;
    localStorage.setItem('refreshFlag', flag);
  }

  getRefreshMxAccount(): string {
    const localStorageFlag = localStorage.getItem('refreshFlag');
    return localStorageFlag && localStorageFlag !== 'undefined'
      ? localStorageFlag
      : this.journeyRefreshMxAccount;
  }

  removeContent(step: JourneyStep): JourneyStep {
    const deletedContentStep = JSON.parse(JSON.stringify(step));
    delete deletedContentStep.content;
    return deletedContentStep;
  }

  publishLeaveJourney() {
    this.leaveJourneyPublisher.publish(undefined);
  }

  getAnswerList(journey: Journey): string[] {
    const answerList = [];
    journey.steps.forEach(step => {
      answerList.push(step.answer);
    });
    return answerList;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getFilteredList(searchUrlParams: string): Promise<FilteredRecords> {
    const currentService = this.journeyServiceMap[
      this.currentJourney.journeyID
    ];
    return currentService.filteredList(searchUrlParams);
  }
}
