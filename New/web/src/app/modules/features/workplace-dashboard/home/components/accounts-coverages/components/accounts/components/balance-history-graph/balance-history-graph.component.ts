import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BalanceHistoryGraph} from '@shared-lib/services/account/models/balance-history-graph.model';
import * as HighCharts from 'highcharts';
import {Subscription} from 'rxjs';
import HC_accessibility from 'highcharts/modules/accessibility';
import {ModalController} from '@ionic/angular';
import {BalanceHistoryModalComponent} from './balance-history-modal/balance-history-modal.component';
import HC_more from 'highcharts/highcharts-more';
import {BalanceHistoryGraphContent} from './models/history-graph-model';
import * as PageText from './constants/balance-history-graph-content.json';

HC_accessibility(HighCharts);

@Component({
  selector: 'app-balance-history-graph',
  templateUrl: './balance-history-graph.component.html',
  styleUrls: ['./balance-history-graph.component.scss'],
})
export class BalanceHistoryGraphComponent implements OnInit, OnDestroy {
  @Input() graphId: string;
  @ViewChild('highchartContainer') highchartContainer: ElementRef;
  pageText: BalanceHistoryGraphContent = (PageText as any).default;

  highCharts = HighCharts;
  chartOptions: Highcharts.Options;
  hcMore: (hc: typeof HighCharts) => void;

  balanceHistoryGraphSubscription = new Subscription();
  balanceHistoryGraphData: BalanceHistoryGraph;
  chartRef: HighCharts.Chart;

  balanceHistoryModalTitle: string;
  balanceHistoryModalText: string;
  displayBalanceHistoryGraph: boolean;

  constructor(
    private accountService: AccountService,
    private modalController: ModalController
  ) {
    this.hcMore = HC_more;
  }

  ngOnInit(): void {
    this.balanceHistoryGraphSubscription.add(
      this.accountService.fetchBalanceHistoryGraph().subscribe(data => {
        if (data) {
          this.balanceHistoryGraphData = data;
          if (
            this.balanceHistoryGraphData?.portfolioBalanceHistory?.length > 0 &&
            this.balanceHistoryGraphData?.years?.length > 0
          ) {
            this.checkPlanBalance();
          }
        }
      })
    );
  }

  checkPlanBalance(): void {
    let planBalance = 0;
    this.balanceHistoryGraphData.portfolioBalanceHistory.forEach(portfolio => {
      portfolio.amounts.forEach(amount => {
        planBalance += parseFloat(amount);
      });
    });
    if (planBalance > 0) {
      this.importHC();
      this.displayBalanceHistoryGraph = true;
      this.checkForHighchartContainer();
      this.getModalContent();
    }
  }

  private importHC(): void {
    this.hcMore(HighCharts);
  }

  checkForHighchartContainer(): void {
    const b = setInterval(
      function() {
        if (this.highchartContainer.nativeElement.clientWidth > 0) {
          clearInterval(b);
          this.createBalanceHistoryGraph();
        }
      }.bind(this),
      500
    );
  }

  getModalContent(): void {
    this.balanceHistoryModalTitle = this.balanceHistoryGraphData.portfolioBalHistText.split(
      '\\r\\n'
    )[0];
    this.balanceHistoryModalText = this.balanceHistoryGraphData.portfolioBalHistText.split(
      '\\r\\n'
    )[1];
  }

  getChartHeight(): number {
    if (window.innerWidth < 400) {
      return 700;
    }
    if (window.innerWidth >= 600) {
      return 500;
    }
  }

  setLegendEnabled(): boolean {
    if (this.balanceHistoryGraphData.portfolioBalanceHistory.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  createBalanceHistoryGraph(): void {
    const seriesData: HighCharts.SeriesOptionsType[] = [];
    const colors = [
      '#145A7B',
      '#00A137',
      '#551B57',
      '#0097A9',
      '#B73F7C',
      '#06395A',
      '#B30000',
      '#8C8C8C',
      '#333333',
      '#D75426',
    ];
    const colorColumn = [];
    for (
      let index = this.balanceHistoryGraphData.years.length - 1;
      index >= 0;
      index--
    ) {
      colorColumn.push(colors[index]);
    }

    this.balanceHistoryGraphData.portfolioBalanceHistory.forEach(
      (portfolio, i) => {
        const amountsArrayInDollars: number[] = [];
        this.balanceHistoryGraphData.years.forEach((_year, j) => {
          amountsArrayInDollars.push(parseFloat(portfolio.amounts[j]));
        });
        seriesData.push({
          name: this.balanceHistoryGraphData.portfolioBalanceHistory[i]
            .planName,
          type: 'column',
          data: amountsArrayInDollars,
        });
      }
    );

    this.chartOptions = {
      accessibility: {
        enabled: true,
        keyboardNavigation: {
          order: ['series', 'legend', 'chartMenu'],
        },
      },
      chart: {
        type: 'column',
        height: this.getChartHeight(),
        reflow: true,
        style: {
          fontFamily: 'ProximaNova',
        },
      },
      colors: colorColumn,
      title: {
        text: null,
        align: 'left',
      },
      xAxis: {
        categories: this.balanceHistoryGraphData.years,
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
          formatter: function() {
            const value = this.value as number;
            return '$' + this.chart.numberFormatter(value, 2, '.', ',');
          },
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
        enabled: this.setLegendEnabled(),
        align: window.innerWidth < 1025 ? 'center' : 'right',
        verticalAlign: window.innerWidth < 1025 ? 'bottom' : 'top',
        layout: 'vertical',
        width: 300,
        x: 0,
        y: 10,
        labelFormatter: function() {
          return this.name;
        },
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
        formatter: function() {
          return (
            '<div class="tooltip-key">' +
            this.x +
            '</br><span>' +
            this.series.name +
            ' : $' +
            HighCharts.numberFormat(this.y, 2, '.', ',') +
            '<br/>Total: $' +
            HighCharts.numberFormat(this.total, 2, '.', ',') +
            '</span></div>'
          );
        },
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
      series: seriesData,
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
                labelFormatter: function() {
                  return this.name;
                },
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
                categories: this.balanceHistoryGraphData.years,
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
    };

    this.highCharts.chart(this.graphId, this.chartOptions);

    window.addEventListener('resize', () => {
      this.highCharts.chart(this.graphId, this.chartOptions);
    });
  }

  async openModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: BalanceHistoryModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        modalTitle: this.balanceHistoryModalTitle,
        modalContent: this.balanceHistoryModalText,
      },
    });
    return modal.present();
  }

  ngOnDestroy(): void {
    this.balanceHistoryGraphSubscription.unsubscribe();
  }
}
