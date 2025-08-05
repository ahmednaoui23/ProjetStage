import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from './utils';
import { getStyle } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;
  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  public mainChart: IChartProps = { type: 'line' };

  async initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = `rgba(${getStyle('--cui-info-rgb')}, .1)`;
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

    let labels: string[] = [];
    let anomaliesData: number[] = [];
    let utilisateursData: number[] = [];

    switch (period) {
      case 'Month': {
        labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];
        anomaliesData = [12, 18, 9, 22, 15, 19, 24];
        utilisateursData = [5, 8, 4, 11, 9, 10, 13];
        break;
      }
      case 'Week': {
        labels = ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'];
        anomaliesData = [7, 15, 9, 14];
        break;
      }
      case 'Day': {
        labels = ['01-08', '02-08', '03-08', '04-08', '05-08', '06-08', '07-08'];
        anomaliesData = [2, 4, 1, 6, 3, 5, 4];
        break;
      }
    }

    const colors = [
      {
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff'
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandDanger,
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    const datasets: ChartDataset[] = [
      {
        data: anomaliesData,
        label: 'Anomalies',
        ...colors[0]
      }
    ];

    if (period === 'Month') {
      datasets.push({
        data: utilisateursData,
        label: 'Utilisateurs',
        ...colors[1]
      });
    }

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          labelColor: (context) =>
            ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales: this.getScales(),
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart = {
      type: 'line',
      options,
      data: {
        labels,
        datasets
      }
    };
  }

  getScales(): ScaleOptions<any> {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    return {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: 30,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: 5
        }
      }
    };
  }
}
