import { EChartsOption } from 'echarts';

export function GenerateRadarChart(
  title: string,
  indicators: any[],
  data: any[],
  legendData: string[]
): EChartsOption {
  return {
    title: {
      text: title,
      textStyle: {
        fontFamily: 'Nazanin',
        fontSize: 20
      },
      right: '10%',
      textAlign: 'center'
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'Nazanin',
        fontWeight: 'bold'
      }
    },
    legend: {
      data: legendData,
      left: '2%',
      bottom: 0,
      textStyle: {
        fontFamily: 'Nazanin',
        fontWeight: 'bold',
        fontSize: 14
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    radar: {
      scale: true,
      axisName: {
        color: '#428BD4',
        fontSize: 14,
        fontFamily: 'Nazanin',
        fontWeight: 'bold'
      },
      indicator: indicators
    },
    series: [{
      type: 'radar',
      symbol: 'circle',
      symbolSize: 15,
      color: ['#3ebeed', '#EC7063', '#42b3a1', '#7f6487', '#004e75'],
      label: {
        show: true,
        fontFamily: 'Bahnschrift',
        position: 'inside'
      },
      data: data
    }]
  }
}
