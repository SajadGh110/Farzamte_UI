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

  // تنظیمات استایل دلخواه - می‌تونی اینها رو به Input تبدیل کنی یا همینجا ثابت بذاری
  private TitleTextStyle = {fontFamily: 'Tahoma', fontWeight: 'bold' as 'bold', fontSize: 18}
  private tooltipTextStyle = { fontFamily: 'Tahoma', fontSize: 12 };

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

    const series: LineSeriesOption[] = types.map(type => {
      const dataForType = dates.map(date => {
        const found = this.data.find(d => d.type === type && d.date === date);
        return found ? found.answered : 0;
      });
      return {
        name: type,
        type: 'line',
        data: dataForType,
        symbolSize: 10,
        // هر نوع رنگ و استایل دلخواه می‌تونی اینجا اضافه کنی
        // مثلا color: '#3498DB' ، می‌تونی بر اساس type رنگ متفاوت بدی
      };
    });

    const option: EChartsOption = {
      title: {
        text: 'آمار کل پاسخ داده‌شده‌ها - بر حسب تاریخ',
        textStyle: this.TitleTextStyle,
        right: 0,
        textAlign: 'left'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        textStyle: this.tooltipTextStyle
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontFamily: 'Tahoma'
        }
      },
      yAxis: {
        type: 'value',
        name: 'تعداد پاسخ داده‌شده'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: types,
        top: 30,
        textStyle: { fontFamily: 'Tahoma' }
      },
      series: series
    };

    this.chartInstance.setOption(option);
  }
}
