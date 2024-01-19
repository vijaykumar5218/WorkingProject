import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  StepContentElement,
  ChartData,
} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as HighCharts from 'highcharts';
import {Subscription} from 'rxjs';
@Component({
  selector: 'journey-step-charts-pie-chart',
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent implements OnInit, AfterViewInit {
  @Input() element: StepContentElement;
  private subscription = new Subscription();
  private highCharts = HighCharts;
  private colors: string[] = [];
  private chart: HighCharts.Chart;
  private isWeb: boolean;
  @ViewChild('pieChartContainer') pieChartContainer: ElementRef;

  constructor(
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    const currentJourney = this.journeyService.getCurrentJourney();
    if (this.journeyService.journeyServiceMap[currentJourney.journeyID]) {
      this.subscription.add(
        this.journeyService.journeyServiceMap[
          currentJourney.journeyID
        ].valueChange.subscribe(() => {
          this.doPieCalculations(
            this.journeyService.journeyServiceMap[currentJourney.journeyID]
          );
        })
      );
    }
  }

  private doPieCalculations(service) {
    this.colors = [];
    const chartData: Array<ChartData> = [];
    this.element.elements.forEach(item => {
      this.colors.push(item.color);
      const value = service[item.answerId];
      chartData.push({
        name: item.label,
        y: Math.round(value),
      });
    });
    this.setLabelAndDistance(chartData);
    this.pushDataToPieChart(chartData);
  }

  private setLabelAndDistance(chartData: ChartData[]) {
    const total = chartData.reduce((a, b) => {
      return a + b.y;
    }, 0);

    chartData.forEach(el => {
      const percentage = this.percentage(el.y, total);
      el.label = percentage === 0 ? '' : Math.round(percentage) + '%';
      el.dataLabels = {
        distance: this.setDistance(percentage),
      };
    });
  }

  private setDistance(value: number): number {
    if (0 < value && value < 25) {
      return -15;
    } else if (26 < value && value < 50) {
      return -50;
    } else {
      return -75;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.chart) {
        this.chart.reflow();
      }
    }, 50);
  }

  private pushDataToPieChart(chartData: Array<ChartData>) {
    this.highCharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    });
    const chartOptions: HighCharts.Options = {
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
            click: function(e) {
              e.preventDefault();
            },
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
          colors: this.colors,
        },
      },
      series: [
        {
          type: 'pie',
          data: chartData,
        },
      ],
    };
    if (!this.isWeb) {
      chartOptions.chart.width = window.innerWidth - 77;
    }
    this.chart = this.highCharts.chart('pie-chart-container', chartOptions);
  }

  private percentage(item: number, total: number): number {
    const percent = (item / total) * 100;
    return percent <= this.element.minValue ? 0 : percent;
  }

  ngOnDestroy() {
    this.pieChartContainer.nativeElement.remove();
    this.subscription.unsubscribe();
  }
}
