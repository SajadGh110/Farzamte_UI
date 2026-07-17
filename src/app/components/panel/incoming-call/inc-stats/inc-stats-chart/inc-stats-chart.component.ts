import { Component, Input, OnChanges, SimpleChanges, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';
import {EChartsOption, LineSeriesOption} from 'echarts';

interface ChartDataItem {
  type: string;
  date: string;
  answered: number;
}

@Component({
  selector: 'app-inc-stats-chart',
  template: `<div #chartContainer style="width: 100%; height: 400px;"></div>`
})
export class IncStatsChartComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() data: ChartDataItem[] = [];

  private chartInstance: echarts.ECharts | undefined;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    this.chartInstance = echarts.init(this.elRef.nativeElement.querySelector('div'));
    this.updateChart();
    window.addEventListener('resize', this.resizeChart);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chartInstance) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }

  resizeChart = () => {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  };

  private updateChart() {
    if (!this.chartInstance || !this.data || this.data.length === 0) {
      return;
    }

    const types = Array.from(new Set(this.data.map(d => d.type)));
    const dates = Array.from(new Set(this.data.map(d => d.date))).sort();

    // تولید سری‌ها با استایل جدید
    const series:LineSeriesOption[] = types.map((type, index) => {
      const dataForType = dates.map(date => {
        const found = this.data.find(d => d.type === type && d.date === date);
        return found ? found.answered : 0;
      });

      // انتخاب رنگ بر اساس اندیس (می‌تونید پالت رنگی دلخواه بذارید)
      const colors = ['#3b82f6', '#9F2D01', '#FFD230', '#99A1AF', '#37BC7D', '#FB2C36'];
      const color = colors[index % colors.length];

      return {
        name: type,
        type: 'line',
        data: dataForType,
        smooth: true,
        color: color,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color + '4D' }, // 30% opacity
            { offset: 1, color: color + '00' }  // شفاف
          ])
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          focus: 'series'
        }
      };
    });

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params: any) => {
          if (!params || params.length === 0) return '';

          // params می‌تونه آرایه‌ای از سری‌ها باشه
          let html = `<div style="font-family: Vazirmatn; direction: rtl; text-align: right; padding: 5px;">
            <b style="color: #1e293b;">${params[0].axisValue}</b><br/>`;

          params.forEach((item: any) => {
            if (item.value !== undefined && item.value !== null) {
              html += `${item.marker} ${item.seriesName}: <b>${item.value}</b><br/>`;
            }
          });

          html += `</div>`;
          return html;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        textStyle: {
          color: '#000',
          fontFamily: 'Vazirmatn'
        }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: true,
        axisLabel: {
          rotate: 45,
          fontFamily: 'Vazirmatn',
          fontSize: 11,
          interval: 0
        },
        axisLine: {
          lineStyle: { color: '#999' }
        }
      },
      yAxis: {
        type: 'value',
        name: 'تعداد پاسخ داده‌شده',
        nameTextStyle: {
          fontFamily: 'Vazirmatn',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0.5
          }
        }
      },
      legend: {
        data: types,
        top: 10,
        textStyle: {
          fontFamily: 'Vazirmatn',
          fontSize: 12,
          color: '#334155'
        },
        itemWidth: 15,
        itemHeight: 10
      },
      series: series
    };

    this.chartInstance.setOption(option);
  }
}
