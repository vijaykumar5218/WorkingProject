import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of, Subscription} from 'rxjs';
import {PieChartComponent} from './pie-chart.component';
import {ChartData} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('PieChartComponent', () => {
  let journeyServiceSpy;
  let serviceSpy;
  let sharedUtilityServiceSpy;
  let valueChange;
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let doPieCalculationsSpy;

  beforeEach(
    waitForAsync(() => {
      doPieCalculationsSpy = jasmine.createSpy();

      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      serviceSpy = jasmine.createSpyObj('Service', ['']);
      serviceSpy.tuition = '40';
      serviceSpy.books = '4';
      serviceSpy.fees = '20';
      serviceSpy.roomAndBoard = '30';
      serviceSpy.totalCost = '100';
      journeyServiceSpy.journeyServiceMap = {
        8: serviceSpy,
      };
      valueChange = of();
      serviceSpy.valueChange = valueChange;
      TestBed.configureTestingModule({
        declarations: [PieChartComponent],
        imports: [IonicModule.forRoot()],
        schemas: [],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(PieChartComponent);
      component = fixture.componentInstance;
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 8});
      component['doPieCalculations'] = doPieCalculationsSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
      component.element = {
        elements: [
          {
            id: 'tuition',
            label: 'Tuition',
            type: 'percent',
            color: '#2A5A78',
          },
          {
            id: 'roomAndBoard',
            label: 'Room & Board',
            type: 'percent',
            color: '#E78531',
          },
          {
            id: 'fees',
            label: 'Fees',
            type: 'percent',
            color: '#A9487A',
          },
          {
            id: 'books',
            label: 'Books',
            type: 'percent',
            color: '#4095A6',
          },
        ],
      };
    });

    it('should set isWeb', () => {
      component.ngOnInit();
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component['isWeb']).toEqual(true);
    });

    it('should not add the subscription if there is no service', () => {
      journeyServiceSpy.journeyServiceMap = {};
      component.ngOnInit();
      expect(component['subscription'].add).not.toHaveBeenCalled();
    });

    it('should add the subscription if there is a service', () => {
      const subscription = new Subscription();
      spyOn(valueChange, 'subscribe').and.callFake(f => {
        f();
        return subscription;
      });

      component.ngOnInit();
      expect(serviceSpy.valueChange.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('doPieCalculations', () => {
    let setLabelAndDistanceSpy;
    let pushDataToPieChartSpy;
    beforeEach(() => {
      component['doPieCalculations'] =
        PieChartComponent.prototype['doPieCalculations'];
      setLabelAndDistanceSpy = jasmine.createSpy();
      component['setLabelAndDistance'] = setLabelAndDistanceSpy;
      pushDataToPieChartSpy = jasmine.createSpy();
      component['pushDataToPieChart'] = pushDataToPieChartSpy;
    });

    it('should create the chart data', () => {
      component.element = {
        elements: [
          {
            answerId: 'tuition',
            label: 'Tuition',
            color: '#2A5A78',
          },
          {
            answerId: 'roomAndBoard',
            label: 'Room & Board',
            color: '#E78531',
          },
          {
            answerId: 'fees',
            label: 'Fees',
            color: '#A9487A',
          },
        ],
      };
      const service = {
        tuition: 5002.25,
        roomAndBoard: 251.67,
        fees: 390.12,
      };
      component['doPieCalculations'](service);
      const expectedChartData = [
        {
          name: 'Tuition',
          y: 5002,
        },
        {
          name: 'Room & Board',
          y: 252,
        },
        {
          name: 'Fees',
          y: 390,
        },
      ];
      expect(pushDataToPieChartSpy).toHaveBeenCalledWith(expectedChartData);
      expect(setLabelAndDistanceSpy).toHaveBeenCalledWith(expectedChartData);
      expect(component['colors']).toEqual(['#2A5A78', '#E78531', '#A9487A']);
    });
  });

  describe('setLabelAndDistance', () => {
    beforeEach(() => {
      component['setLabelAndDistance'] =
        PieChartComponent.prototype['setLabelAndDistance'];
      component.element = {
        minValue: 5,
      };
    });

    it('should set the label and distance according to the percentage', () => {
      const chartData: ChartData[] = [
        {
          name: 'Tuition',
          y: 2400,
        },
        {
          name: 'Room & Board',
          y: 2500,
        },
        {
          name: 'Fees',
          y: 5100,
        },
      ];
      component['setLabelAndDistance'](chartData);
      expect(chartData).toEqual([
        {
          name: 'Tuition',
          y: 2400,
          label: '24%',
          dataLabels: {
            distance: -15,
          },
        },
        {
          name: 'Room & Board',
          y: 2500,
          label: '25%',
          dataLabels: {
            distance: -75,
          },
        },
        {
          name: 'Fees',
          y: 5100,
          label: '51%',
          dataLabels: {
            distance: -75,
          },
        },
      ]);
    });

    it('should set the label to empty if percentage is less than the min value', () => {
      const chartData: ChartData[] = [
        {
          name: 'Tuition',
          y: 200,
        },
        {
          name: 'Room & Board',
          y: 4900,
        },
        {
          name: 'Fees',
          y: 4900,
        },
      ];
      component['setLabelAndDistance'](chartData);
      expect(chartData).toEqual([
        {
          name: 'Tuition',
          y: 200,
          label: '',
          dataLabels: {
            distance: -75,
          },
        },
        {
          name: 'Room & Board',
          y: 4900,
          label: '49%',
          dataLabels: {
            distance: -50,
          },
        },
        {
          name: 'Fees',
          y: 4900,
          label: '49%',
          dataLabels: {
            distance: -50,
          },
        },
      ]);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call reflow on chart', fakeAsync(() => {
      component['chart'] = jasmine.createSpyObj('Chart', ['reflow']);
      component.ngAfterViewInit();
      tick(51);
      expect(component['chart'].reflow).toHaveBeenCalled();
    }));
  });

  describe('pushDataToPieChart', () => {
    it('should load pie chart with width for mobile', () => {
      const chartObj = {} as Highcharts.Chart;
      const highChartSpy = jasmine.createSpyObj('HighCharts', [
        'chart',
        'setOptions',
      ]);
      highChartSpy.chart.and.returnValue(chartObj);
      component['colors'] = ['#2A5A78'];
      component['highCharts'] = highChartSpy;
      const chartData = [
        {
          label: 'books',
          name: 'Books',
          dataLabels: {
            distance: 30,
          },
          y: 100,
          value: 100,
        },
      ];
      component['isWeb'] = false;
      component['pushDataToPieChart'](chartData);
      expect(component['highCharts'].chart).toHaveBeenCalledWith(
        'pie-chart-container',
        {
          credits: {
            enabled: false,
          },
          chart: {
            height: 300,
            width: window.innerWidth - 77,
          },
          title: {
            text: undefined,
          },
          plotOptions: {
            pie: {
              size: '80%',
              events: {
                click: jasmine.any(Function) as any,
              },
              allowPointSelect: true,
              tooltip: {
                headerFormat: undefined,
                pointFormat: '<b>{point.name} : ${point.y:,.0f}</b>',
              },
              dataLabels: {
                format: '<b>{point.label}</b>',
                useHTML: true,
                style: {
                  fontWeight: 'bold',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                },
              },
              startAngle: 0,
              endAngle: 0,
              center: ['50%', '50%'],
              colors: ['#2A5A78'],
            },
          },
          series: [
            {
              type: 'pie',
              data: chartData,
            },
          ],
        }
      );
      expect(component['chart']).toEqual(chartObj);
    });

    it('should load pie chart without width for web', () => {
      const chartObj = {} as Highcharts.Chart;
      const highChartSpy = jasmine.createSpyObj('HighCharts', [
        'chart',
        'setOptions',
      ]);
      highChartSpy.chart.and.returnValue(chartObj);
      component['colors'] = ['#2A5A78'];
      component['highCharts'] = highChartSpy;
      const chartData = [
        {
          label: 'books',
          name: 'Books',
          dataLabels: {
            distance: 30,
          },
          y: 100,
          value: 100,
        },
      ];
      component['isWeb'] = true;
      component['pushDataToPieChart'](chartData);
      expect(component['highCharts'].chart).toHaveBeenCalledWith(
        'pie-chart-container',
        {
          credits: {
            enabled: false,
          },
          chart: {
            height: 300,
          },
          title: {
            text: undefined,
          },
          plotOptions: {
            pie: {
              size: '80%',
              events: {
                click: jasmine.any(Function) as any,
              },
              allowPointSelect: true,
              tooltip: {
                headerFormat: undefined,
                pointFormat: '<b>{point.name} : ${point.y:,.0f}</b>',
              },
              dataLabels: {
                format: '<b>{point.label}</b>',
                useHTML: true,
                style: {
                  fontWeight: 'bold',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                },
              },
              startAngle: 0,
              endAngle: 0,
              center: ['50%', '50%'],
              colors: ['#2A5A78'],
            },
          },
          series: [
            {
              type: 'pie',
              data: chartData,
            },
          ],
        }
      );
      expect(component['chart']).toEqual(chartObj);
    });

    it('prevent click on pie slice', () => {
      const event = jasmine.createSpyObj('click', ['preventDefault'], {
        point: {
          name: 'Books',
          y: 100,
        },
      });
      const highChartSpy = jasmine.createSpyObj('HighCharts', [
        'chart',
        'setOptions',
      ]);
      component['highCharts'] = highChartSpy;
      const chartData = [
        {
          label: 'books',
          name: 'Books',
          dataLabels: {
            distance: 30,
          },
          y: 100,
          value: 100,
        },
      ];
      component['pushDataToPieChart'](chartData);
      const clickFunction = highChartSpy.chart.calls.all()[0].args[1]
        .plotOptions.pie.events.click;
      clickFunction(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should remove the pie-chart-container', () => {
      spyOn(component.pieChartContainer.nativeElement, 'remove');
      component.ngOnDestroy();
      expect(
        component.pieChartContainer.nativeElement.remove
      ).toHaveBeenCalled();
    });

    it('should unsubscribe from subscription', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
