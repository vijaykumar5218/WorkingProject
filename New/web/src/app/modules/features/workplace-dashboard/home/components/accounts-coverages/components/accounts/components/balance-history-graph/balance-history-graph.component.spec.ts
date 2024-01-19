import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BalanceHistoryGraph} from '@shared-lib/services/account/models/balance-history-graph.model';
import {of, Subscription} from 'rxjs';

import {BalanceHistoryGraphComponent} from './balance-history-graph.component';
import {BalanceHistoryModalComponent} from './balance-history-modal/balance-history-modal.component';

describe('BalanceHistoryGraphComponent', () => {
  let component: BalanceHistoryGraphComponent;
  let fixture: ComponentFixture<BalanceHistoryGraphComponent>;

  let accountServiceSpy;
  let addEventListenerSpy;
  let modalControllerSpy;

  const balanceHistoryGraph: BalanceHistoryGraph = {
    portfolioBalHistText:
      'How much are your accounts changing year over year?\\r\\nThe balance history graphic includes current accounts and data your current provider has on record for that calendar year. Account values fluctuate with market conditions, and when surrendered the principal may be worth more or less than its original amount invested.',
    portfolioBalanceHistory: [
      {
        planName: 'New York City Deferred Compensation 457 Plan',
        planId: '626001',
        amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
      },
      {
        planName: 'New York City Deferred Compensation 457 Payout Account',
        planId: '626002',
        amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
      },
    ],
    years: ['2018', '2019', '2020', '2021', 'Current'],
  };

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('EdgeService', [
        'fetchBalanceHistoryGraph',
      ]);

      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

      TestBed.configureTestingModule({
        declarations: [BalanceHistoryGraphComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BalanceHistoryGraphComponent);
      component = fixture.componentInstance;

      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(
        of(balanceHistoryGraph)
      );

      spyOn(component, 'checkPlanBalance');
      spyOn(component, 'checkForHighchartContainer');
      spyOn(component, 'getModalContent');
      spyOn(component, 'getChartHeight').and.returnValue(500);
      spyOn(component, 'setLegendEnabled').and.returnValue(true);
      spyOn(component, 'createBalanceHistoryGraph');
      spyOn(component, 'openModal');
      addEventListenerSpy = spyOn(window, 'addEventListener');

      component.hcMore = jasmine.createSpy();
      component.graphId = 'test-graph-id';
    })
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch balance history graph data from account service, set balanceHistoryGraphData, and call checkForHighchartContainer if balanceHistoryGraphData.portfolioBalanceHistory.length and balanceHistoryGraphData.years.length > 0', () => {
      component.balanceHistoryGraphData = undefined;
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toEqual(balanceHistoryGraph);
      expect(component.checkPlanBalance).toHaveBeenCalled();
    });
    it('should fetch balance history graph data from account service, set balanceHistoryGraphData, and not call checkForHighChartContiner if balanceHistoryGraphData.portfolioBalanceHistory not defined', () => {
      component.balanceHistoryGraphData = undefined;
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(
        of({
          years: ['2018', '2019', '2020', '2021', 'Current'],
        })
      );
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toEqual({
        years: ['2018', '2019', '2020', '2021', 'Current'],
      });
      expect(component.checkPlanBalance).not.toHaveBeenCalled();
    });
    it('should fetch balance history graph data from account service, set balanceHistoryGraphData, and not call checkForHighChartContiner if balanceHistoryGraphData.portfolioBalanceHistory.length is 0', () => {
      component.balanceHistoryGraphData = undefined;
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(
        of({
          portfolioBalanceHistory: [],
          years: ['2018', '2019', '2020', '2021', 'Current'],
        })
      );
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toEqual({
        portfolioBalanceHistory: [],
        years: ['2018', '2019', '2020', '2021', 'Current'],
      });
      expect(component.checkPlanBalance).not.toHaveBeenCalled();
    });
    it('should fetch balance history graph data from account service, set balanceHistoryGraphData, and not call checkForHighChartContiner if balanceHistoryGraphData.portfolioBalanceHistory.length > 0, but balanceHistoryGraphData.years not defined', () => {
      component.balanceHistoryGraphData = undefined;
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(
        of({
          portfolioBalanceHistory: [
            {
              planName: 'New York City Deferred Compensation 457 Plan',
              planId: '626001',
              amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
            },
            {
              planName:
                'New York City Deferred Compensation 457 Payout Account',
              planId: '626002',
              amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
            },
          ],
        })
      );
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toEqual({
        portfolioBalanceHistory: [
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
          },
          {
            planName: 'New York City Deferred Compensation 457 Payout Account',
            planId: '626002',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
          },
        ],
      });
      expect(component.checkPlanBalance).not.toHaveBeenCalled();
    });
    it('should fetch balance history graph data from account service, set balanceHistoryGraphData, and not call checkForHighChartContiner if balanceHistoryGraphData.portfolioBalanceHistory.length > 0, but balanceHistoryGraphData.years.length is 0', () => {
      component.balanceHistoryGraphData = undefined;
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(
        of({
          portfolioBalanceHistory: [
            {
              planName: 'New York City Deferred Compensation 457 Plan',
              planId: '626001',
              amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
            },
            {
              planName:
                'New York City Deferred Compensation 457 Payout Account',
              planId: '626002',
              amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
            },
          ],
          years: [],
        })
      );
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toEqual({
        portfolioBalanceHistory: [
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
          },
          {
            planName: 'New York City Deferred Compensation 457 Payout Account',
            planId: '626002',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
          },
        ],
        years: [],
      });
      expect(component.checkPlanBalance).not.toHaveBeenCalled();
    });
    it('should fetch balance history graph data from account service, not set balanceHistoryGraphData and not call checkForHighChartContiner if no data returned', () => {
      component.balanceHistoryGraphData = undefined;
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(of(undefined));
      fixture.detectChanges();
      expect(component.balanceHistoryGraphData).toBeUndefined();
      expect(component.checkPlanBalance).not.toHaveBeenCalled();
    });
  });

  describe('checkPlanBalance', () => {
    beforeEach(() => {
      (<any>component.checkPlanBalance).and.callThrough();
      component['importHC'] = jasmine.createSpy();
    });
    it('should set displayBalanceHistoryGraph to true and call importHC, checkHighchartContainer and getModalContent if plan balance > 0', () => {
      component.displayBalanceHistoryGraph = undefined;
      fixture.detectChanges();
      component.checkPlanBalance();
      expect(component.displayBalanceHistoryGraph).toBeTrue();
      expect(component['importHC']).toHaveBeenCalled();
      expect(component.checkForHighchartContainer).toHaveBeenCalled();
      expect(component.getModalContent).toHaveBeenCalled();
    });
    it('should not set displayBalanceHistoryGraph or call checkHighchartContainer and getModalContent if plan balance = 0', () => {
      component.displayBalanceHistoryGraph = undefined;
      component.balanceHistoryGraphData = {
        portfolioBalHistText:
          'How much are your accounts changing year over year?\\r\\nThe balance history graphic includes current accounts and data your current provider has on record for that calendar year. Account values fluctuate with market conditions, and when surrendered the principal may be worth more or less than its original amount invested.',
        portfolioBalanceHistory: [
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['0.0', '0.0', '0.0', '0.0', '0.0'],
          },
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['0.0', '0.0', '0.0', '0.0', '0.0'],
          },
        ],
        years: ['2018', '2019', '2020', '2021', 'Current'],
      };
      component.checkPlanBalance();
      expect(component.displayBalanceHistoryGraph).toBeUndefined();
      expect(component.checkForHighchartContainer).not.toHaveBeenCalled();
      expect(component.getModalContent).not.toHaveBeenCalled();
    });
  });

  describe('importHC', () => {
    it('should import hcMore', () => {
      component['importHC']();
      expect(component.hcMore).toHaveBeenCalled();
    });
  });

  describe('checkForHighchartContainer', () => {
    beforeEach(() => {
      (<any>component.checkForHighchartContainer).and.callThrough();
      spyOn(window, 'setInterval');
    });
    it('should call createBalanceHistoryGraph if highchart container width > 0', () => {
      fixture.detectChanges();
      component.highchartContainer = {
        nativeElement: {
          clientWidth: 100,
        },
      };
      let func;
      (<any>window.setInterval).and.callFake(f => {
        func = f;
        return jasmine.createSpyObj('interval', ['']);
      });
      component.checkForHighchartContainer();
      func();
      expect(component.createBalanceHistoryGraph).toHaveBeenCalled();
    });
    it('should not call createBalanceHistoryGraph if highchart container width is 0', () => {
      fixture.detectChanges();
      component.highchartContainer = {
        nativeElement: {
          clientWidth: 0,
        },
      };
      component.checkForHighchartContainer();
      expect(component.createBalanceHistoryGraph).not.toHaveBeenCalled();
    });
  });

  describe('getModalContent', () => {
    it('should set balanceHistoryModalTitle and balanceHistoryModalText', () => {
      (<any>component.getModalContent).and.callThrough();
      component.balanceHistoryModalTitle = undefined;
      component.balanceHistoryModalText = undefined;
      fixture.detectChanges();
      component.getModalContent();
      expect(component.balanceHistoryModalTitle).toEqual(
        'How much are your accounts changing year over year?'
      );
      expect(component.balanceHistoryModalText).toEqual(
        'The balance history graphic includes current accounts and data your current provider has on record for that calendar year. Account values fluctuate with market conditions, and when surrendered the principal may be worth more or less than its original amount invested.'
      );
    });
  });

  describe('getChartHeight', () => {
    beforeEach(() => {
      (<any>component.getChartHeight).and.callThrough();
    });
    it('should return height as 700 if window.innerWidth is < 400', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(300);
      fixture.detectChanges();
      const result = component.getChartHeight();
      expect(result).toEqual(700);
    });
    it('should return height as 500 if window.innerWidth is 600', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(600);
      fixture.detectChanges();
      const result = component.getChartHeight();
      expect(result).toEqual(500);
    });
    it('should return height as 500 if window.innerWidth is > 600', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(601);
      fixture.detectChanges();
      const result = component.getChartHeight();
      expect(result).toEqual(500);
    });
  });

  describe('setLegendEnabled', () => {
    beforeEach(() => {
      (<any>component.setLegendEnabled).and.callThrough();
    });
    it('should return true if there is more than one plan', () => {
      component.balanceHistoryGraphData = balanceHistoryGraph;
      fixture.detectChanges();
      const result = component.setLegendEnabled();
      expect(result).toBeTrue();
    });
    it('should return false if there is one plan', () => {
      fixture.detectChanges();
      component.balanceHistoryGraphData = {
        portfolioBalHistText:
          'How much are your accounts changing year over year?\\r\\nThe balance history graphic includes current accounts and data your current provider has on record for that calendar year. Account values fluctuate with market conditions, and when surrendered the principal may be worth more or less than its original amount invested.',
        portfolioBalanceHistory: [
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
          },
        ],
        years: ['2018', '2019', '2020', '2021', 'Current'],
      };
      const result = component.setLegendEnabled();
      expect(result).toBeFalse();
    });
  });

  describe('createBalanceHistoryGraph', () => {
    it('should create balance history graph with balanceHistoryGraphData with legend to right if window.innerWidth > 1025', () => {
      (<any>component.createBalanceHistoryGraph).and.callThrough();
      spyOnProperty(window, 'innerWidth').and.returnValue(1080);

      component.balanceHistoryGraphData = balanceHistoryGraph;
      addEventListenerSpy.and.callFake((e, f) => {
        expect(e).toEqual('resize');
        f();
        expect(highChartSpy.chart).toHaveBeenCalled();
      });

      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);
      const chartSpy = jasmine.createSpyObj('chart', ['numberFormatter']);
      chartSpy.numberFormatter.and.returnValue('$1,000.00');

      component.highCharts = highChartSpy;
      fixture.detectChanges();
      component.highchartContainer = {
        nativeElement: {
          clientWidth: 100,
        },
      };
      component.createBalanceHistoryGraph();
      const result = highChartSpy.chart.calls
        .all()[0]
        .args[1].responsive.rules[0].chartOptions.legend.labelFormatter.bind({
          name: 'name',
        })();
      expect(result).toEqual('name');
      expect(component.getChartHeight).toHaveBeenCalled();
      expect(component.setLegendEnabled).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(component.highCharts.chart).toHaveBeenCalledWith('test-graph-id', {
        accessibility: {
          enabled: true,
          keyboardNavigation: {
            order: ['series', 'legend', 'chartMenu'],
          },
        },
        chart: {
          type: 'column',
          height: 500,
          reflow: true,
          style: {
            fontFamily: 'ProximaNova',
          },
        },
        colors: ['#B73F7C', '#0097A9', '#551B57', '#00A137', '#145A7B'],
        title: {
          text: null,
          align: 'left',
        },
        xAxis: {
          categories: ['2018', '2019', '2020', '2021', 'Current'],
          labels: {
            rotation: 315,
            x: 5,
            y: 10,
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px',
            },
          },
        },
        yAxis: {
          title: {
            text: 'Total Balance',
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px',
            },
            x: 0,
          },
          labels: {
            formatter: jasmine.any(Function) as any,
            style: {
              fontWeight: 'bold',
              color: '#333333',
              fontSize: '16px',
            },
          },
          stackLabels: {
            enabled: false,
          },
        },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical',
          width: 300,
          x: 0,
          y: 10,
          labelFormatter: jasmine.any(Function) as any,
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false,
          floating: false,
          itemStyle: {
            fontSize: '16px',
            textOverflow: undefined,
          },
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          formatter: jasmine.any(Function) as any,
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            stacking: 'normal',
            dataLabels: {
              enabled: false,
            },
            pointWidth: 25,
            accessibility: {
              enabled: true,
              keyboardNavigation: {
                enabled: true,
              },
            },
          },
        },
        series: [
          {
            name: 'New York City Deferred Compensation 457 Plan',
            type: 'column',
            data: [45000.0, 0.0, 0.0, 0.0, 72277.76],
          },
          {
            name: 'New York City Deferred Compensation 457 Payout Account',
            type: 'column',
            data: [45000, 0, 0, 0, 12540.82],
          },
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 420,
              },
              chartOptions: {
                legend: {
                  align: 'center',
                  verticalAlign: 'bottom',
                  layout: 'horizontal',
                  width: 300,
                  x: 1,
                  y: 8,
                  labelFormatter: jasmine.any(Function) as any,
                  borderColor: '#CCC',
                  borderWidth: 1,
                  shadow: false,
                  floating: false,
                  itemStyle: {
                    fontSize: '16px',
                    textOverflow: 'none',
                  },
                },
                xAxis: {
                  categories: ['2018', '2019', '2020', '2021', 'Current'],
                  width: 160,
                  labels: {
                    padding: 0,
                  },
                },
                plotOptions: {
                  column: {
                    pointWidth: 12,
                  },
                },
              },
            },
          ],
        },
      });
    });
    it('should create balance history graph with balanceHistoryGraphData with legend on bottom if window.innerWidth < 1025', () => {
      (<any>component.createBalanceHistoryGraph).and.callThrough();
      spyOnProperty(window, 'innerWidth').and.returnValue(400);
      component.balanceHistoryGraphData = balanceHistoryGraph;
      addEventListenerSpy.and.callFake((e, f) => {
        expect(e).toEqual('resize');
        f();
        expect(highChartSpy.chart).toHaveBeenCalled();
      });

      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);
      const chartSpy = jasmine.createSpyObj('chart', ['numberFormatter']);
      chartSpy.numberFormatter.and.returnValue('$1,000.00');

      component.highCharts = highChartSpy;
      fixture.detectChanges();
      component.highchartContainer = {
        nativeElement: {
          clientWidth: 100,
        },
      };
      component.createBalanceHistoryGraph();
      const result = highChartSpy.chart.calls
        .all()[0]
        .args[1].responsive.rules[0].chartOptions.legend.labelFormatter.bind({
          name: 'name',
        })();
      expect(result).toEqual('name');
      expect(component.getChartHeight).toHaveBeenCalled();
      expect(component.setLegendEnabled).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(component.highCharts.chart).toHaveBeenCalledWith('test-graph-id', {
        accessibility: {
          enabled: true,
          keyboardNavigation: {
            order: ['series', 'legend', 'chartMenu'],
          },
        },
        chart: {
          type: 'column',
          height: 500,
          reflow: true,
          style: {
            fontFamily: 'ProximaNova',
          },
        },
        colors: ['#B73F7C', '#0097A9', '#551B57', '#00A137', '#145A7B'],
        title: {
          text: null,
          align: 'left',
        },
        xAxis: {
          categories: ['2018', '2019', '2020', '2021', 'Current'],
          labels: {
            rotation: 315,
            x: 5,
            y: 10,
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px',
            },
          },
        },
        yAxis: {
          title: {
            text: 'Total Balance',
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px',
            },
            x: 0,
          },
          labels: {
            formatter: jasmine.any(Function) as any,
            style: {
              fontWeight: 'bold',
              color: '#333333',
              fontSize: '16px',
            },
          },
          stackLabels: {
            enabled: false,
          },
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'vertical',
          width: 300,
          x: 0,
          y: 10,
          labelFormatter: jasmine.any(Function) as any,
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false,
          floating: false,
          itemStyle: {
            fontSize: '16px',
            textOverflow: undefined,
          },
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          formatter: jasmine.any(Function) as any,
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            stacking: 'normal',
            dataLabels: {
              enabled: false,
            },
            pointWidth: 25,
            accessibility: {
              enabled: true,
              keyboardNavigation: {
                enabled: true,
              },
            },
          },
        },
        series: [
          {
            name: 'New York City Deferred Compensation 457 Plan',
            type: 'column',
            data: [45000.0, 0.0, 0.0, 0.0, 72277.76],
          },
          {
            name: 'New York City Deferred Compensation 457 Payout Account',
            type: 'column',
            data: [45000, 0, 0, 0, 12540.82],
          },
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 420,
              },
              chartOptions: {
                legend: {
                  align: 'center',
                  verticalAlign: 'bottom',
                  layout: 'horizontal',
                  width: 300,
                  x: 1,
                  y: 8,
                  labelFormatter: jasmine.any(Function) as any,
                  borderColor: '#CCC',
                  borderWidth: 1,
                  shadow: false,
                  floating: false,
                  itemStyle: {
                    fontSize: '16px',
                    textOverflow: 'none',
                  },
                },
                xAxis: {
                  categories: ['2018', '2019', '2020', '2021', 'Current'],
                  width: 160,
                  labels: {
                    padding: 0,
                  },
                },
                plotOptions: {
                  column: {
                    pointWidth: 12,
                  },
                },
              },
            },
          ],
        },
      });
    });
  });

  describe('openModal', () => {
    it('should create modal with modalController', async () => {
      (<any>component.openModal).and.callThrough();
      component.balanceHistoryModalTitle = 'test title';
      component.balanceHistoryModalText = 'test text';
      const modal = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      await component.openModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: BalanceHistoryModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          modalTitle: 'test title',
          modalContent: 'test text',
        },
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from balanceHistoryGraphSubscription', () => {
      component.balanceHistoryGraphSubscription = new Subscription();
      const subscription = spyOn(
        component.balanceHistoryGraphSubscription,
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(subscription).toHaveBeenCalledTimes(1);
    });
  });
});
