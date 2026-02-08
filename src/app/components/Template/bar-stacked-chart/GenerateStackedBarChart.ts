import { EChartsOption } from "echarts";

export function GenerateStackedBarChart(title: string, categories: string[], dates: string[], brokerDataSeries: any[], totalDataSeries: any[]): EChartsOption {
  const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

  const series: any[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!dates || dates.length === 0) return {};

  dates.forEach((date, dIdx) => {
    const currentBrokerData = brokerDataSeries[dIdx] || [];
    const currentTotalData = totalDataSeries[dIdx] || [];

    const sharePercentages = categories.map((_, cIdx) => {
      const val = currentBrokerData[cIdx] || 0;
      const total = currentTotalData[cIdx] || 0;
      return total > 0 ? round2((val / total) * 100) : 0;
    });

    const remainingMarket = sharePercentages.map(pct => round2(100 - pct));

    series.push({
      name: `سهم از بازار - ${date}`,
      type: 'bar',
      stack: `stack${dIdx}`,
      label: {
        show: true,
        position: 'right',
        distance: 10,
        formatter: '{c}%',
        color: '#333',
        fontFamily: 'Vazirmatn',
        fontWeight: 'bold',
        fontSize: 11
      },
      itemStyle: {
        color: colors[dIdx % colors.length],
        borderRadius: [0, 4, 4, 0]
      },
      data: sharePercentages
    });

    series.push({
      name: `سایر - ${date}`,
      type: 'bar',
      stack: `stack${dIdx}`,
      itemStyle: { color: '#f3f4f6' },
      emphasis: { disabled: true },
      data: remainingMarket
    });
  });

  return {
    title: {
      text: title,
      left: 'center',
      textStyle: { fontFamily: 'Vazirmatn', fontSize: 14, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        let res = `<div dir="rtl" style="font-family:Vazirmatn; padding:5px;"><b>${params[0].name}</b><br/>`;
        params.forEach((item: any) => {
          if (item.seriesName.includes('سهم')) {
            res += `${item.marker} ${item.seriesName} : %${item.value}<br/>`;
          }
        });
        return res + `</div>`;
      }
    },
    grid: { left: '3%', right: '12%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%', fontFamily: 'Vazirmatn' },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontFamily: 'Vazirmatn', fontSize: 11, fontWeight: 'bold' }
    },
    series: series
  };
}
