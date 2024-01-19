import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {InfoModalComponent} from './info-modal/info-modal.component';
import * as pageText from '../constants/text-data.json';
import * as chartText from '../constants/chartData.json';
import * as tpaTxt from '../constants/tpaInsightData.json';
import * as moment from 'moment';
import * as HighCharts from 'highcharts';
import {
  OutNetworkCost,
  HealthUtlization,
  PieData,
  HealthContent,
  BubbleData,
  InsightsHealthCheck,
  HealthDates,
} from '../models/chart.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  Benefits,
  Benefit,
  MyHealthWealth,
} from '@shared-lib/services/benefits/models/benefits.model';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import HC_more from 'highcharts/highcharts-more';
import {
  NoBenefitContent,
  NotificationContent,
} from '@shared-lib/services/benefits/models/noBenefit.model';
import {ConsentType} from '@shared-lib/services/consent/constants/consentType.enum';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {NavigationEnd, Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {delay, filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {
  GroupedClaims,
  TPAClaimsData,
  TPAInsightContent,
} from '@shared-lib/services/tpa-stream/models/tpa.model';
HC_more(HighCharts);

interface ExtendedChart extends Highcharts.PlotPackedbubbleOptions {
  layoutAlgorithm: {
    splitSeries: any;
  };
}

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  pageText: Record<string, string> = pageText;
  preYear = moment(Date.now())
    .add(-1, 'years')
    .format('YYYY');
  currYear = moment(Date.now()).format('YYYY');
  selectedYear = moment(Date.now()).format('YYYY');
  currentDate = moment(Date.now()).format('MMMM DD, YYYY');
  contentP: HealthContent = (chartText as any).default;
  contentTPA: TPAInsightContent = (tpaTxt as any).default;
  healthData: HealthUtlization;
  newData: PieData[] = [];
  coverages: Benefits;
  healthBenefit: Benefit;
  outNetCost: OutNetworkCost;
  bubbleData: BubbleData[] = [];
  healthCheckUp: InsightsHealthCheck;
  totalPremium = 0;
  totalSpending = 0;
  hc: any;
  hasConsent = false;
  benefitsContent: NoBenefitContent;
  benAuthHeader: string;
  benAuthMessage: string;
  revokeMessage: string;
  isHealthUtilizationAvail: boolean;
  loading = true;
  isTpa: boolean;
  totalOutOutOfPocketCost: number;
  slctdYearTPAData: GroupedClaims;
  isFocus: boolean;

  yearTabs = [
    {
      year: this.contentP.thisYearTxt,
    },
    {
      year: this.contentP.lastYearTxt,
    },
  ];

  segment = this.contentP.segmentValue;
  healthDates: HealthDates;
  totalHealthSpend = 0;
  isDate: boolean;
  isDesktop: boolean;
  guidanceEnabled: boolean;
  nohealthData: NotificationContent;
  myHealthWealth: MyHealthWealth;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;
  isWeb: boolean;
  subscription = new Subscription();
  tpaData: TPAClaimsData;
  tpaSubscription = new Subscription();

  constructor(
    private benefitServices: BenefitsService,
    private modalController: ModalController,
    private consentService: ConsentService,
    private sharedUtilityService: SharedUtilityService,
    private router: Router,
    private tpaService: TPAStreamService,
    private accessService: AccessService
  ) {
    this.hc = HighCharts;
    this.sharedUtilityService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  async ngOnInit() {
    this.benefitServices.getNoBenefitContents().then(res => {
      this.benefitsContent = res;
      this.myHealthWealth = JSON.parse(
        this.benefitsContent.Insights_ManageMyHealthandWealth
      );
    });
    await this.checkIsTpa();
  }

  ionViewWillEnter() {
    this.checkAuthorization();
    this.scrollToTop();
    this.getGuidanceEnable();
  }

  async checkIsTpa(): Promise<void> {
    const {enableTPA} = await this.accessService.checkMyvoyageAccess();

    if (enableTPA == 'Y') {
      this.isTpa = true;
    } else {
      this.isTpa = false;
    }
    return Promise.resolve();
  }

  async getGuidanceEnable() {
    this.guidanceEnabled = (
      await this.benefitServices.getGuidanceEnabled()
    ).guidanceEnabled;
  }

  async checkAuthorization() {
    this.consentService
      .getMedicalConsent()
      .subscribe(async (consent: boolean) => {
        this.hasConsent = consent;

        if (this.hasConsent || this.isTpa) {
          this.loadInsightsData();
        }
        this.loading = false;
      });
  }

  async revokeAuthorization() {
    const content = JSON.parse(
      this.benefitsContent.Insights_TurnOffClaimsAuthorization
    );
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: content.ClaimsAuth_title,
        message: content.ClaimsAuth_description,
        yesButtonTxt: this.pageText.yes,
        noButtonTxt: this.pageText.notNow,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            this.segment = this.contentP.segmentValue;
            this.consentService
              .setConsent(ConsentType.MEDICAL, false)
              .then(() => {
                this.consentService.getMedicalConsent(true);
                if (this.isWeb) {
                  if (this.isDesktop) {
                    this.router.navigateByUrl(
                      '/coverages/all-coverages/insights'
                    );
                  } else {
                    this.router.navigateByUrl('/coverages/all-coverages/plans');
                  }
                } else {
                  this.router.navigateByUrl('/coverages/coverage-tabs/plans');
                }
                this.benefitServices.publishSelectedTab('plans');
                res(true);
              });
          });
        },
      },
    });
    modal.present();
  }

  async loadInsightsData() {
    this.fetchBenefits();
    this.fetchNoHealthContent();
    this.getSelectedYear();

    this.getSpending();
    this.getHealthCheckContent();
    this.isHealthUtilizationAvail = this.isTpa;
  }

  toggleYear(val: string | number) {
    this.resetPieData(this.contentP.pieDefaultSubTitle, this.allCatgryValue());
    this.segment = val?.toString();
    this.getSelectedYear();
    this.getSpending();
    this.getHealthCheckContent();
    if (this.segment === '1') {
      this.totalPremium = 0;
    } else {
      this.fetchBenefits();
    }
  }

  openGuidelines() {
    this.benefitServices.openGuidelines();
  }

  fetchBenefits() {
    this.benefitServices.getBenefits().then((data: Benefits) => {
      this.coverages = data;

      if (this.coverages && this.coverages.enrolled) {
        if (
          this.coverages.enrolled.filter(val => val.type === 'medical_plan')
            .length > 0
        ) {
          this.totalPremium = this.coverages.enrolled.filter(
            val => val.type === 'medical_plan'
          )[0].totalPremium;
        }
      }
    });
  }

  getSelectedYear() {
    if (this.segment == '0') {
      this.healthDates = {
        startDate: moment()
          .startOf('year')
          .format('MM/DD/YYYY'),
        endDate: moment()
          .endOf('year')
          .format('MM/DD/YYYY'),
      };
      this.isDate = true;
      this.selectedYear = moment(Date.now()).format('YYYY');
    } else {
      this.healthDates = {
        startDate: moment()
          .startOf('year')
          .add(-1, 'years')
          .format('MM/DD/YYYY'),
        endDate: moment()
          .endOf('year')
          .add(-1, 'years')
          .format('MM/DD/YYYY'),
      };
      this.isDate = false;
      this.selectedYear = moment(Date.now())
        .add(-1, 'years')
        .format('YYYY');
    }
  }

  async getSpending() {
    if (this.isTpa) {
      this.getSpendingTPA();
    } else {
      this.getSpendingRegular();
    }
  }

  getSpendingRegular() {
    this.benefitServices
      .fetchSpending(this.healthDates, true)
      .then((resp: HealthUtlization) => {
        if (resp != null) {
          const keys = Object.keys(resp?.groupingCategoryDetails);

          if (keys.length) {
            this.isHealthUtilizationAvail = true;
          } else {
            this.isHealthUtilizationAvail = false;
          }

          this.healthData = resp;
          this.contentP.title =
            this.healthData?.outNetworkCost?.outOfPocketCost +
              this.healthData?.inNetworkCost?.outOfPocketCost || 0;
          this.totalHealthSpend =
            this.contentP?.title > 0 ? this.contentP?.title : 0;
        } else {
          this.isHealthUtilizationAvail = false;
        }
        this.createPieData();
        this.loadChart();
        this.createBubleData();
        this.bubbleChart();
      });
  }

  getSpendingTPA() {
    this.tpaSubscription = this.tpaService
      .getTPAData()
      .subscribe((tpaData: TPAClaimsData) => {
        this.tpaData = tpaData;
        this.hasConsent = this.tpaData.claims.length > 0;
        this.slctdYearTPAData = this.tpaData?.groupingClaimsByYear[
          this.selectedYear
        ];
        this.contentP.title =
          this.slctdYearTPAData?.outOfPocketAmountTotal || 0;
        this.totalHealthSpend = this.contentP.title;

        this.healthData = {
          inNetworkCountTotal: this.slctdYearTPAData?.inNetworkTotalCount,
          outNetworkCountTotal: this.slctdYearTPAData?.outNetworkTotalCount,
        } as HealthUtlization;

        this.createPieDataTpa();
        this.loadChart();
        this.createBubleDataTpa();
        this.bubbleChart();
      });
  }

  fetchNoHealthContent() {
    this.benefitServices
      .getNoHealthDataContent()
      .then((data: NotificationContent) => {
        this.nohealthData = data;
      });
  }

  getHealthCheckContent() {
    this.getSelectedYear();
    this.benefitServices
      .fetchHealthCheckContent(this.healthDates)
      .then((resp: InsightsHealthCheck) => {
        this.healthCheckUp = resp;
      });
  }

  viewClaims() {
    let claimsAddr = 'claims';
    if (this.isTpa) {
      claimsAddr = 'tpaclaims';
    }

    if (this.isWeb) {
      this.router.navigateByUrl('/coverages/all-coverages/' + claimsAddr);
    } else {
      this.router.navigateByUrl('/coverages/coverage-tabs/' + claimsAddr);
    }
    this.benefitServices.getSelectedTab$().next(claimsAddr);
  }

  checkForContainer(containerName: string): Promise<void> {
    const poll = async resolve => {
      const container = document.getElementById(containerName);
      if (container && container.offsetWidth > 0) {
        resolve();
      } else {
        setTimeout(() => {
          poll(resolve);
        }, 50);
      }
    };
    return new Promise(poll);
  }

  async loadChart() {
    await this.checkForContainer('container');
    this.hc.chart('container', {
      credits: false,
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: 330,
      },
      title: {
        text: '',
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
            },
          },
          startAngle: 90,
          endAngle: 90,
          center: ['50%', '50%'],
          opacity: 1,
          borderWidth: 1,
          fillColor: '#a6a6a6',
        },
      },
      series: [
        {
          type: 'pie',
          name: '',
          innerSize: '80%',
          dataLabels: {
            enabled: false,
          },

          states: {
            inactive: {
              opacity: 1,
            },
          },

          events: {
            click: event => {
              this.changePie(event.point.name, event.point.y);
            },
            mouseOut: () => {
              this.resetPieData(
                this.contentP.pieDefaultSubTitle,
                this.allCatgryValue()
              );
            },
          },
          data: this.newData,
        },
      ],
    });
  }

  allCatgryValue(): number {
    if (this.isTpa) {
      return this.slctdYearTPAData.outOfPocketAmountTotal;
    } else {
      return (
        this.healthData.inNetworkCost.outOfPocketCost +
        this.healthData.outNetworkCost.outOfPocketCost
      );
    }
  }

  changePie(name: string, val: number) {
    this.contentP.title = val;
    this.contentP.pieSubTitle = name;
  }

  resetPieData(name: string, val: number) {
    this.contentP.pieSubTitle = name;
    this.contentP.title = val;
  }

  createPieData() {
    if (this.healthData?.categoryDetail) {
      const keys = Object.keys(this.healthData.categoryDetail?.outNetworkCost);
      this.newData = [];
      keys.forEach(key => {
        const res = {
          name: this.contentP.outNetworkCostNames[key],
          y:
            this.healthData.categoryDetail.outNetworkCost[key] +
            this.healthData.categoryDetail.inNetworkCost[key],
          color: this.contentP.colors[key],
        };

        this.newData.push(res);
      });
    }
  }

  createPieDataTpa() {
    const keys = Object.keys(this.slctdYearTPAData?.aggregateServiceNameClaims);
    this.newData = [];
    keys.forEach(key => {
      const res = {
        name: this.contentTPA.serviceName[key],
        y: this.slctdYearTPAData.aggregateServiceNameClaims[key]
          .outOfPocketAmountTotal,
        color: this.contentTPA.colors[key],
      };

      this.newData.push(res);
    });
  }

  async openModal(): Promise<void> {
    const title = JSON.parse(
      this.benefitsContent.TotalHealthSpend_DisclaimerTile
    );
    const message = JSON.parse(
      this.benefitsContent.TotalHealthSpending_Disclaimer
    );
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        headerText: title.disclaimer_title,
        bodyText: message.disclaimer_message,
      },
    });
    return modal.present();
  }

  createBubleDataTpa() {
    const tpaDat = this.tpaData?.groupingClaimsByYear[this.selectedYear];
    if (tpaDat) {
      this.bubbleData = [];
      Object.keys(tpaDat.aggregateServiceNameClaims).forEach(key => {
        const data = tpaDat.aggregateServiceNameClaims[key];
        const res = {
          name: this.contentTPA.serviceName[key],
          value: data.inNetworkTotalCount + data.outNetworkTotalCount,
          color: this.contentTPA.colors[key],
          in: data.inNetworkTotalCount,
          out: data.outNetworkTotalCount,
        };

        const bubbleDat = {
          name: this.contentTPA.serviceName[key],
          data: [res],
          showInLegend: false,
        };

        if (res.value > 0) {
          this.bubbleData.push(bubbleDat);
        }
      });
    }
  }

  createBubleData() {
    if (this.healthData?.inNetworkEventCount) {
      const keys = Object.keys(this.healthData.inNetworkEventCount);
      this.bubbleData = [];
      keys.forEach(key => {
        const res = {
          name: this.contentP.outNetworkCostNames[key],
          value:
            this.healthData.inNetworkEventCount[key] +
            this.healthData.outNetworkEventCount[key],
          color: this.contentP.colors[key],
          in: this.healthData.inNetworkEventCount[key],
          out: this.healthData.outNetworkEventCount[key],
        };

        const bubbleDat = {
          name: this.contentP.outNetworkCostNames[key],
          data: [res],
          showInLegend: false,
        };

        if (res.value > 0) {
          this.bubbleData.push(bubbleDat);
        }
      });
    }
  }

  async bubbleChart() {
    await this.checkForContainer('bubbleContainer');
    this.hc.chart({
      credits: false,
      chart: {
        renderTo: 'bubbleContainer',
        type: 'packedbubble',
      },
      title: {
        text: '',
      },
      tooltip: {
        outside: true,
        useHTML: true,
        headerFormat: '',
        pointFormat:
          "<p style='font-size:16px;font-weight:bold;margin:0;'>{point.value}</p> <p style='font-size:14px;font-weight:bold;margin:5px 0 5px 0;'> {point.name} </p>   {point.in} In Network Visits  <br/> {point.out} Out of Network Visits ",
        backgroundColor: '#fff',
        style: {
          color: 'black',
          textAlign: 'center',
          minWidth: 200,
          fontSize: '12px',
          zIndex: 11111,
          opacity: 0.9,
        },
      },
      plotOptions: {
        packedbubble: {
          clip: false,
          minSize: '65%',
          maxSize: '450%',
          allowOverlap: false,
          zIndex: 100,
          zMin: 1,
          zMax: 1000,
          stickyTracking: false,
          layoutAlgorithm: {
            splitSeries: false,
            gravitationalConstant: 0.01,
            bubblePadding: 5,
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            align: 'center',
            allowOverlap: false,
            className: 'highlight',
            format: '{point.value} <br/>{point.name}',
            inside: false,
            filter: {
              property: 'value',
              operator: '>=',
              value: 0,
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal',
              textAlign: 'center',
              width: 62,
            },
          },
          marker: {
            fillOpacity: 1,
          },
        } as ExtendedChart,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 300,
            },
          },
        ],
      },
      series: this.bubbleData,
    });
  }

  scrollToTop() {
    if (this.isWeb) {
      const routerSubscription = this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          delay(100)
        )
        .subscribe(() => {
          this.sharedUtilityService.scrollToTop(this.topmostElement);
        });
      this.subscription.add(routerSubscription);
    }
  }

  onMouseClick() {
    this.isFocus = true;
  }

  onKeyboardNavigation() {
    this.isFocus = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.tpaSubscription.unsubscribe();
  }
}
