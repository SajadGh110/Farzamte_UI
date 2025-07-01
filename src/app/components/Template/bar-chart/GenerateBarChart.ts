import { EChartsOption } from 'echarts';

export function GenerateBarChart(
  title: string,
  legend: string[],
  categories: string[],
  series: any[],
  colors: string[] = ['#3ebeed', '#EC7063', '#42b3a1', '#7f6487', '#004e75']
): EChartsOption {
  return {
    title: {
      text: title,
      textStyle: { fontFamily: 'Nazanin', fontSize: 20 },
      right: '10%', textAlign: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: 'Nazanin', fontWeight: 'bold' }
    },
    legend: {
      data: legend,
      left: '2%', bottom: 0,
      textStyle: { fontFamily: 'Nazanin', fontWeight: 'bold', fontSize: 14 }
    },
    color: colors,
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
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        show: true,
        fontFamily: 'Nazanin',
        fontWeight: 'bold',
        fontSize: 14,
        rotate: 10
      }
    },
    yAxis: { type: 'value' },
    series: series
  };
}
