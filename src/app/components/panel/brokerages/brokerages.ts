import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {Menu1Component} from "../../Template/menu1/menu1.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {NgToastService} from "ng-angular-popup";
import {NgForOf, NgIf} from "@angular/common";
import {BrokerageService} from "../../../services/brokerage.service";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTabsModule} from '@angular/material/tabs';
import {last} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-brokerages',
    templateUrl: './brokerages.html',
    imports: [
        DashboardSidebarComponent,
        Menu1Component,
        ReactiveFormsModule,
        DashboardContactComponent,
        NgForOf,
        FormsModule,
        NgxEchartsDirective,
        MatProgressSpinner,
        NgIf,
        MatTabsModule
    ],
    styleUrls: ['./brokerages.scss']
})
export class Brokerages implements OnInit {
  public constructor(private router:Router,private toast:NgToastService, private getData:BrokerageService, private auth:AuthService) {}
  series_date:any = [];
  years:any = [];
  selected_date:any = [];
  protected flag_date:boolean=false;
  protected flag_totals:boolean=false;
  protected flag_chart1:boolean=false;
  protected flag_chart2:boolean=false;
  protected flag_chart3:boolean=false;
  protected flag_chart4:boolean=false;
  protected flag_chart5:boolean=false;
  chart1_max:number = 0;
  chart2_max:number = 0;
  chart3_max:number = 0;
  chart4_max:number = 0;
  chart5_max:number = 0;
  brokerage_name:any = '';
  brokerage_logo:any = '';
  series_totals:any = [];
  series_color = ['#3ebeed','#EC7063','#42b3a1','#7f6487','#004e75'];
  TitleTextStyle: any= {
    fontFamily: 'Nazanin', fontSize: '20px',
  };
  tooltipTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold'
  }
  legendTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold', fontSize:'14px'
  }
  label: any = {show:true,fontSize:14,fontWeight:'bold',fontFamily:'Nazanin',position:'top',formatter: (params:any) => {return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');}};
  // Chart 1
  series_Chart1_radar:EChartsOption = {
    title: {text: 'رتبه کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'item', textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    radar: {
      scale:true,
      axisName: {color: '#428BD4', fontSize:14, fontFamily:'Nazanin',fontWeight:'bold'},
      indicator: [
        { name: 'بورس اوراق بهادار',min:1},
        { name: 'فرابورس',min:1},
        { name: 'تجمیع بورس اوراق بهادار و فرابورس',min:1},
        { name: 'بورس کالا',min:1},
        { name: 'بورس انرژی',min:1},
        { name: 'ارزش کل معاملات (بورس و فرابورس)',min:1}
      ]
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        color:this.series_color,
        symbolSize: 15,label:{show:true,fontFamily:'Bahnschrift',position:'inside'},
        data: []
      }
    ]
  };
  series_Chart1_bar:EChartsOption = {
    title: {text: 'ارزش معاملات کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بورس اوراق بهادار','فرابورس','تجمیع بورس اوراق بهادار و فرابورس','بورس کالا','بورس انرژی','ارزش کل معاملات (بورس و فرابورس)'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart1_bar_total:EChartsOption = {
    title: {text: 'ارزش کل معاملات', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بورس اوراق بهادار','فرابورس','تجمیع بورس اوراق بهادار و فرابورس','بورس کالا','بورس انرژی','ارزش کل معاملات (بورس و فرابورس)'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[],color:'#3ebeed'}]
  };
  series_Chart1_line:EChartsOption = {
    title: {text: 'رتبه کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بورس اوراق بهادار','فرابورس','تجمیع بورس اوراق بهادار و فرابورس','بورس کالا','بورس انرژی','ارزش کل معاملات (بورس و فرابورس)'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بورس اوراق بهادار',data: [], type: 'line', symbolSize: 10},
      {name: 'فرابورس',data: [], type: 'line', symbolSize: 10},
      {name: 'تجمیع بورس اوراق بهادار و فرابورس',data: [], type: 'line', symbolSize: 10},
      {name: 'بورس کالا',data: [], type: 'line', symbolSize: 10},
      {name: 'بورس انرژی',data: [], type: 'line', symbolSize: 10},
      {name: 'ارزش کل معاملات (بورس و فرابورس)',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  // Chart 2
  series_Chart2_radar:EChartsOption = {
    title: {text: 'رتبه بورس اوراق بهادار', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'item', textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    radar: {
      scale:true,
      axisName: {color: '#428BD4', fontSize:14, fontFamily:'Nazanin',fontWeight:'bold'},
      indicator: [
        { name: 'بازار اوراق بدهی',min:1},
        { name: 'بازار اوراق مشتقه',min:1},
        { name: 'بازار سرمایه‌گذار حرفه‌ای',min:1},
        { name: 'بازار سهام',min:1},
        { name: 'کل بورس اوراق بهادار',min:1}
      ]
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        color:this.series_color,
        symbolSize: 15,label:{show:true,fontFamily:'Bahnschrift',position:'inside'},
        data: []
      }
    ]
  };
  series_Chart2_bar:EChartsOption = {
    title: {text: 'ارزش معاملات کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بازار اوراق بدهی','بازار اوراق مشتقه','بازار سرمایه‌گذار حرفه‌ای','بازار سهام','کل بورس اوراق بهادار'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart2_bar_total:EChartsOption = {
    title: {text: 'ارزش کل معاملات', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بازار اوراق بدهی','بازار اوراق مشتقه','بازار سرمایه‌گذار حرفه‌ای','بازار سهام','کل بورس اوراق بهادار'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart2_line:EChartsOption = {
    title: {text: 'رتبه بورس اوراق بهادار', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بازار اوراق بدهی','بازار اوراق مشتقه','بازار سرمایه‌گذار حرفه‌ای','بازار سهام','کل بورس اوراق بهادار'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بازار اوراق بدهی',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار اوراق مشتقه',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سرمایه‌گذار حرفه‌ای',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سهام',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس اوراق بهادار',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  // Chart 3
  series_Chart3_radar:EChartsOption = {
    title: {text: 'رتبه فرابورس', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'item', textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    radar: {
      scale:true,
      axisName: {color: '#428BD4', fontSize:14, fontFamily:'Nazanin',fontWeight:'bold'},
      indicator: [
        { name: 'معاملات ایستگاه کارگزاری',min:1},
        { name: 'معاملات برخط عادی',min:1},
        { name: 'معاملات برخط گروهی',min:1},
        { name: 'معاملات سایر برخط',min:1},
        { name: 'کل فرابورس',min:1}
      ]
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        color:this.series_color,
        symbolSize: 15,label:{show:true,fontFamily:'Bahnschrift',position:'inside'},
        data: []
      }
    ]
  };
  series_Chart3_bar:EChartsOption = {
    title: {text: 'ارزش معاملات کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['معاملات ایستگاه کارگزاری','معاملات برخط عادی','معاملات برخط گروهی','معاملات سایر برخط','کل فرابورس'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart3_bar_total:EChartsOption = {
    title: {text: 'ارزش کل معاملات', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['معاملات ایستگاه کارگزاری','معاملات برخط عادی','معاملات برخط گروهی','معاملات سایر برخط','کل فرابورس'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart3_line:EChartsOption = {
    title: {text: 'رتبه فرابورس', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['معاملات ایستگاه کارگزاری','معاملات برخط عادی','معاملات برخط گروهی','معاملات سایر برخط','کل فرابورس'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'معاملات ایستگاه کارگزاری',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات برخط عادی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات برخط گروهی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات سایر برخط',data: [], type: 'line', symbolSize: 10},
      {name: 'کل فرابورس',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  // Chart 4
  series_Chart4_radar:EChartsOption = {
    title: {text: 'رتبه بورس کالا', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'item', textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    radar: {
      scale:true,
      axisName: {color: '#428BD4', fontSize:14, fontFamily:'Nazanin',fontWeight:'bold'},
      indicator: [
        { name: 'معاملات فیزیکی',min:1},
        { name: 'معاملات سلف موازی',min:1},
        { name: 'معاملات آتی',min:1},
        { name: 'معاملات اختیار معامله',min:1},
        { name: 'کل بورس کالا',min:1}
      ]
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        color:this.series_color,
        symbolSize: 15,label:{show:true,fontFamily:'Bahnschrift',position:'inside'},
        data: []
      }
    ]
  };
  series_Chart4_bar:EChartsOption = {
    title: {text: 'ارزش معاملات کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['معاملات فیزیکی','معاملات سلف موازی','معاملات آتی','معاملات اختیار معامله','کل بورس کالا'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart4_bar_total:EChartsOption = {
    title: {text: 'ارزش کل معاملات', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['معاملات فیزیکی','معاملات سلف موازی','معاملات آتی','معاملات اختیار معامله','کل بورس کالا'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart4_line:EChartsOption = {
    title: {text: 'رتبه بورس کالا', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['معاملات فیزیکی','معاملات سلف موازی','معاملات آتی','معاملات اختیار معامله','کل بورس کالا'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'معاملات فیزیکی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات سلف موازی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات آتی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات اختیار معامله',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس کالا',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  // Chart 5
  series_Chart5_radar:EChartsOption = {
    title: {text: 'رتبه بورس انرژی', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'item', textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    radar: {
      scale:true,
      axisName: {color: '#428BD4', fontSize:14, fontFamily:'Nazanin',fontWeight:'bold'},
      indicator: [
        { name: 'بازار فیزیکی',min:1},
        { name: 'بازار مشتقه',min:1},
        { name: 'بازار سایر اوراق بهادار',min:1},
        { name: 'کل بورس انرژی',min:1}
      ]
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        color:this.series_color,
        symbolSize: 15,label:{show:true,fontFamily:'Bahnschrift',position:'inside'},
        data: []
      }
    ]
  };
  series_Chart5_bar:EChartsOption = {
    title: {text: 'ارزش معاملات کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بازار فیزیکی','بازار مشتقه','بازار سایر اوراق بهادار','کل بورس انرژی'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart5_bar_total:EChartsOption = {
    title: {text: 'ارزش کل معاملات', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {data: [], left:'2%', bottom:0, textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      data: ['بازار فیزیکی','بازار مشتقه','بازار سایر اوراق بهادار','کل بورس انرژی'],
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14,rotate:10},
    },
    yAxis: {
      type: 'value'
    },
    series: [{type: 'bar',name:'',data:[]}]
  };
  series_Chart5_line:EChartsOption = {
    title: {text: 'رتبه بورس انرژی', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بازار فیزیکی','بازار مشتقه','بازار سایر اوراق بهادار','کل بورس انرژی'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بازار فیزیکی',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار مشتقه',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سایر اوراق بهادار',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس انرژی',data: [], type: 'line', symbolSize: 10}
    ]
  };

  async ngOnInit(){
    if(this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin"){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }
    let res_brokerage_name = await this.getData.Get_Brokerage_Name().toPromise();
    this.brokerage_name = "کارگزاری " + res_brokerage_name[0].name;
    this.brokerage_logo = "assets/images/brokers/" + res_brokerage_name[0].logo;
    this.series_date = await this.getData.get_AllDate().toPromise();
    this.series_date = this.series_date.sort((a:any, b:any) => {
      let [yearA, monthA] = a.split('-').map(Number);
      let [yearB, monthB] = b.split('-').map(Number);
      if (yearA === yearB) {
        return monthA - monthB;
      } else {
        return yearA - yearB;
      }
    });
    this.years = this.series_date.reduce((acc:any, date:any) => {
      const [year] = date.split('-');
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(date);
      return acc;
    }, {});
    if (this.series_date.length == 0){
      this.toast.error({ detail: "ERROR", summary: 'Your Selected Brokerage, Don\'t Have a Data', duration: 5000, position: 'topRight' });
    }
    if (this.series_date.length == 1){
      this.selected_date.push(this.series_date[0]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
    if (this.series_date.length >= 2){
      this.selected_date.push(this.series_date[this.series_date.length-1]);
      this.selected_date.push(this.series_date[this.series_date.length-2]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
  }

  async do(selected_date:[]){
    this.flag_totals = false;
    this.flag_chart1 = false;
    this.flag_chart2 = false;
    this.flag_chart3 = false;
    this.flag_chart4 = false;
    this.flag_chart5 = false;
    this.series_totals = [];
    (this.series_Chart1_radar.series as any)[0].data = [];
    (this.series_Chart1_radar.legend as any).data = [];
    (this.series_Chart1_bar.series as any)=[];
    (this.series_Chart1_bar.legend as any).data = [];
    (this.series_Chart1_bar_total.series as any)=[];
    (this.series_Chart1_bar_total.legend as any).data = [];
    (this.series_Chart1_line.series as any)[0].data = [];
    (this.series_Chart1_line.series as any)[1].data = [];
    (this.series_Chart1_line.series as any)[2].data = [];
    (this.series_Chart1_line.series as any)[3].data = [];
    (this.series_Chart1_line.series as any)[4].data = [];
    (this.series_Chart1_line.series as any)[5].data = [];
    (this.series_Chart1_line.xAxis as any).data = [];
    (this.series_Chart2_radar.series as any)[0].data = [];
    (this.series_Chart2_radar.legend as any).data = [];
    (this.series_Chart2_bar.series as any)=[];
    (this.series_Chart2_bar.legend as any).data = [];
    (this.series_Chart2_bar_total.series as any)=[];
    (this.series_Chart2_bar_total.legend as any).data = [];
    (this.series_Chart2_line.series as any)[0].data = [];
    (this.series_Chart2_line.series as any)[1].data = [];
    (this.series_Chart2_line.series as any)[2].data = [];
    (this.series_Chart2_line.series as any)[3].data = [];
    (this.series_Chart2_line.series as any)[4].data = [];
    (this.series_Chart2_line.xAxis as any).data = [];
    (this.series_Chart3_radar.series as any)[0].data = [];
    (this.series_Chart3_radar.legend as any).data = [];
    (this.series_Chart3_bar.series as any)=[];
    (this.series_Chart3_bar.legend as any).data = [];
    (this.series_Chart3_bar_total.series as any)=[];
    (this.series_Chart3_bar_total.legend as any).data = [];
    (this.series_Chart3_line.series as any)[0].data = [];
    (this.series_Chart3_line.series as any)[1].data = [];
    (this.series_Chart3_line.series as any)[2].data = [];
    (this.series_Chart3_line.series as any)[3].data = [];
    (this.series_Chart3_line.series as any)[4].data = [];
    (this.series_Chart3_line.xAxis as any).data = [];
    (this.series_Chart4_radar.series as any)[0].data = [];
    (this.series_Chart4_radar.legend as any).data = [];
    (this.series_Chart4_bar.series as any)=[];
    (this.series_Chart4_bar.legend as any).data = [];
    (this.series_Chart4_bar_total.series as any)=[];
    (this.series_Chart4_bar_total.legend as any).data = [];
    (this.series_Chart4_line.series as any)[0].data = [];
    (this.series_Chart4_line.series as any)[1].data = [];
    (this.series_Chart4_line.series as any)[2].data = [];
    (this.series_Chart4_line.series as any)[3].data = [];
    (this.series_Chart4_line.series as any)[4].data = [];
    (this.series_Chart4_line.xAxis as any).data = [];
    (this.series_Chart5_radar.series as any)[0].data = [];
    (this.series_Chart5_radar.legend as any).data = [];
    (this.series_Chart5_bar.series as any)=[];
    (this.series_Chart5_bar.legend as any).data = [];
    (this.series_Chart5_bar_total.series as any)=[];
    (this.series_Chart5_bar_total.legend as any).data = [];
    (this.series_Chart5_line.series as any)[0].data = [];
    (this.series_Chart5_line.series as any)[1].data = [];
    (this.series_Chart5_line.series as any)[2].data = [];
    (this.series_Chart5_line.series as any)[3].data = [];
    (this.series_Chart5_line.xAxis as any).data = [];
    selected_date = selected_date.sort((a:any, b:any) => {
      let [yearA, monthA] = a.split('-').map(Number);
      let [yearB, monthB] = b.split('-').map(Number);
      if (yearA === yearB) {
        return monthA - monthB;
      } else {
        return yearA - yearB;
      }
    });
    try {
      let res_totals = [];
      let res_chart1 = [];
      let res_chart2 = [];
      let res_chart3 = [];
      let res_chart4 = [];
      let res_chart5 = [];
      let chart1_max_r1 = [];
      let chart2_max_r1 = [];
      let chart3_max_r1 = [];
      let chart4_max_r1 = [];
      let chart5_max_r1 = [];
      for (let item in selected_date){
        res_chart1 = await this.getData.get_Chart1(selected_date[item]).toPromise();
        let brokerage_rank = [];
        brokerage_rank[0] = res_chart1.bobT_Brokerage_Rank;
        brokerage_rank[1] = res_chart1.fI_Brokerage_Rank;
        brokerage_rank[2] = res_chart1.bobT_AND_FI_Brokerage_Rank;
        brokerage_rank[3] = res_chart1.bkI_Brokerage_Rank;
        brokerage_rank[4] = res_chart1.beI_Brokerage_Rank;
        brokerage_rank[5] = res_chart1.all_Brokerage_Rank;
        chart1_max_r1.push(Math.max(...brokerage_rank));
        let brokerage_value = [];
        brokerage_value[0] = res_chart1.bobT_Brokerage_Value;
        brokerage_value[1] = res_chart1.fI_Brokerage_Value;
        brokerage_value[2] = res_chart1.bobT_AND_FI_Brokerage_Value;
        brokerage_value[3] = res_chart1.bkI_Brokerage_Value;
        brokerage_value[4] = res_chart1.beI_Brokerage_Value;
        brokerage_value[5] = res_chart1.all_Brokerage_Value;
        let total_value = [];
        total_value[0] = res_chart1.bobT_Total_Value;
        total_value[1] = res_chart1.fI_Total_Value;
        total_value[2] = res_chart1.bobT_AND_FI_Total_Value;
        total_value[3] = res_chart1.bkI_Total_Value;
        total_value[4] = res_chart1.beI_Total_Value;
        total_value[5] = res_chart1.all_Total_Value;
        (this.series_Chart1_radar.series as any)[0].data.push({name:selected_date[item], value:brokerage_rank});
        (this.series_Chart1_radar.legend as any).data.push(selected_date[item]);
        (this.series_Chart1_bar.series as any).push({name:selected_date[item],type:'bar',data:brokerage_value,color:this.series_color[item],label:this.label});
        (this.series_Chart1_bar.legend as any).data.push(selected_date[item]);
        (this.series_Chart1_bar_total.series as any).push({name:selected_date[item],type:'bar',data:total_value,color:this.series_color[item],label:this.label});
        (this.series_Chart1_bar_total.legend as any).data.push(selected_date[item]);
        (this.series_Chart1_line.series as any)[0].data.push(brokerage_rank[0]);
        (this.series_Chart1_line.series as any)[1].data.push(brokerage_rank[1]);
        (this.series_Chart1_line.series as any)[2].data.push(brokerage_rank[2]);
        (this.series_Chart1_line.series as any)[3].data.push(brokerage_rank[3]);
        (this.series_Chart1_line.series as any)[4].data.push(brokerage_rank[4]);
        (this.series_Chart1_line.series as any)[5].data.push(brokerage_rank[5]);
        (this.series_Chart1_line.xAxis as any).data.push(selected_date[item]);

        res_totals = await this.getData.get_totals(selected_date[item]).toPromise();
        this.series_totals.push(res_totals);
      }
      this.chart1_max = Math.max(...chart1_max_r1);
      this.chart1_max += 5;
      (this.series_Chart1_radar.radar as any).indicator[0].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[1].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[2].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[3].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[4].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[5].max = this.chart1_max;
      this.flag_chart1 = true;
      this.flag_totals = true;
      for (let item in selected_date) {
        res_chart2 = await this.getData.get_Chart2(selected_date[item]).toPromise();
        let brokerage_rank = [];
        brokerage_rank[0] = res_chart2.bobT_Oragh_Bedehi_Rank;
        brokerage_rank[1] = res_chart2.bobT_Moshtaghe_Rank;
        brokerage_rank[2] = res_chart2.bobT_Sarmaye_Herfei_Rank;
        brokerage_rank[3] = res_chart2.bobT_saham_Rank;
        brokerage_rank[4] = res_chart2.bobT_Brokerage_Rank;
        chart2_max_r1.push(Math.max(...brokerage_rank));
        let brokerage_value = [];
        brokerage_value[0] = res_chart2.bobT_Oragh_Bedehi;
        brokerage_value[1] = res_chart2.bobT_Moshtaghe;
        brokerage_value[2] = res_chart2.bobT_Sarmaye_Herfei;
        brokerage_value[3] = res_chart2.bobT_saham;
        brokerage_value[4] = res_chart2.bobT_Brokerage_Value;
        let total_value = [];
        total_value[0] = res_chart2.bobT_Oragh_Bedehi_Total;
        total_value[1] = res_chart2.bobT_Moshtaghe_Total;
        total_value[2] = res_chart2.bobT_Sarmaye_Herfei_Total;
        total_value[3] = res_chart2.bobT_saham_Total;
        total_value[4] = res_chart2.bobT_Total_Value;
        (this.series_Chart2_radar.series as any)[0].data.push({name:selected_date[item], value:brokerage_rank});
        (this.series_Chart2_radar.legend as any).data.push(selected_date[item]);
        (this.series_Chart2_bar.series as any).push({name:selected_date[item],type:'bar',data:brokerage_value,color:this.series_color[item],label:this.label});
        (this.series_Chart2_bar.legend as any).data.push(selected_date[item]);
        (this.series_Chart2_bar_total.series as any).push({name:selected_date[item],type:'bar',data:total_value,color:this.series_color[item],label:this.label});
        (this.series_Chart2_bar_total.legend as any).data.push(selected_date[item]);
        (this.series_Chart2_line.series as any)[0].data.push(brokerage_rank[0]);
        (this.series_Chart2_line.series as any)[1].data.push(brokerage_rank[1]);
        (this.series_Chart2_line.series as any)[2].data.push(brokerage_rank[2]);
        (this.series_Chart2_line.series as any)[3].data.push(brokerage_rank[3]);
        (this.series_Chart2_line.series as any)[4].data.push(brokerage_rank[4]);
        (this.series_Chart2_line.xAxis as any).data.push(selected_date[item]);
      }
      this.chart2_max = Math.max(...chart2_max_r1);
      this.chart2_max += 5;
      (this.series_Chart2_radar.radar as any).indicator[0].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[1].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[2].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[3].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[4].max = this.chart2_max;
      this.flag_chart2 = true;
      for (let item in selected_date) {
        res_chart3 = await this.getData.get_Chart3(selected_date[item]).toPromise();
        let brokerage_rank = [];
        brokerage_rank[0] = res_chart3.fI_Brokerage_Station_Rank;
        brokerage_rank[1] = res_chart3.fI_Online_Normal_Rank;
        brokerage_rank[2] = res_chart3.fI_Online_Group_Rank;
        brokerage_rank[3] = res_chart3.fI_Online_Other_Rank;
        brokerage_rank[4] = res_chart3.fI_Brokerage_Value_Rank;
        chart3_max_r1.push(Math.max(...brokerage_rank));
        let brokerage_value = [];
        brokerage_value[0] = res_chart3.fI_Brokerage_Station;
        brokerage_value[1] = res_chart3.fI_Online_Normal;
        brokerage_value[2] = res_chart3.fI_Online_Group;
        brokerage_value[3] = res_chart3.fI_Online_Other;
        brokerage_value[4] = res_chart3.fI_Brokerage_Value;
        let total_value = [];
        total_value[0] = res_chart3.fI_Brokerage_Station_Total;
        total_value[1] = res_chart3.fI_Online_Normal_Total;
        total_value[2] = res_chart3.fI_Online_Group_Total;
        total_value[3] = res_chart3.fI_Online_Other_Total;
        total_value[4] = res_chart3.fI_Total_Value;
        (this.series_Chart3_radar.series as any)[0].data.push({name:selected_date[item], value:brokerage_rank});
        (this.series_Chart3_radar.legend as any).data.push(selected_date[item]);
        (this.series_Chart3_bar.series as any).push({name:selected_date[item],type:'bar',data:brokerage_value,color:this.series_color[item],label:this.label});
        (this.series_Chart3_bar.legend as any).data.push(selected_date[item]);
        (this.series_Chart3_bar_total.series as any).push({name:selected_date[item],type:'bar',data:total_value,color:this.series_color[item],label:this.label});
        (this.series_Chart3_bar_total.legend as any).data.push(selected_date[item]);
        (this.series_Chart3_line.series as any)[0].data.push(brokerage_rank[0]);
        (this.series_Chart3_line.series as any)[1].data.push(brokerage_rank[1]);
        (this.series_Chart3_line.series as any)[2].data.push(brokerage_rank[2]);
        (this.series_Chart3_line.series as any)[3].data.push(brokerage_rank[3]);
        (this.series_Chart3_line.series as any)[4].data.push(brokerage_rank[4]);
        (this.series_Chart3_line.xAxis as any).data.push(selected_date[item]);
      }
      this.chart3_max = Math.max(...chart3_max_r1);
      this.chart3_max += 5;
      (this.series_Chart3_radar.radar as any).indicator[0].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[1].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[2].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[3].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[4].max = this.chart3_max;
      this.flag_chart3 = true;
      for (let item in selected_date) {
        res_chart4 = await this.getData.get_Chart4(selected_date[item]).toPromise();
        let brokerage_rank = [];
        brokerage_rank[0] = res_chart4.bkI_Physical_Rank;
        brokerage_rank[1] = res_chart4.bkI_Self_Rank;
        brokerage_rank[2] = res_chart4.bkI_Ati_Rank;
        brokerage_rank[3] = res_chart4.bkI_Ekhtiar_Rank;
        brokerage_rank[4] = res_chart4.bkI_Brokerage_Value_Rank;
        chart4_max_r1.push(Math.max(...brokerage_rank));
        let brokerage_value = [];
        brokerage_value[0] = res_chart4.bkI_Physical;
        brokerage_value[1] = res_chart4.bkI_Self;
        brokerage_value[2] = res_chart4.bkI_Ati;
        brokerage_value[3] = res_chart4.bkI_Ekhtiar;
        brokerage_value[4] = res_chart4.bkI_Brokerage_Value;
        let total_value = [];
        total_value[0] = res_chart4.bkI_Physical_Total;
        total_value[1] = res_chart4.bkI_Self_Total;
        total_value[2] = res_chart4.bkI_Ati_Total;
        total_value[3] = res_chart4.bkI_Ekhtiar_Total;
        total_value[4] = res_chart4.bkI_Total_Value;
        (this.series_Chart4_radar.series as any)[0].data.push({name:selected_date[item], value:brokerage_rank});
        (this.series_Chart4_radar.legend as any).data.push(selected_date[item]);
        (this.series_Chart4_bar.series as any).push({name:selected_date[item],type:'bar',data:brokerage_value,color:this.series_color[item],label:this.label});
        (this.series_Chart4_bar.legend as any).data.push(selected_date[item]);
        (this.series_Chart4_bar_total.series as any).push({name:selected_date[item],type:'bar',data:total_value,color:this.series_color[item],label:this.label});
        (this.series_Chart4_bar_total.legend as any).data.push(selected_date[item]);
        (this.series_Chart4_line.series as any)[0].data.push(brokerage_rank[0]);
        (this.series_Chart4_line.series as any)[1].data.push(brokerage_rank[1]);
        (this.series_Chart4_line.series as any)[2].data.push(brokerage_rank[2]);
        (this.series_Chart4_line.series as any)[3].data.push(brokerage_rank[3]);
        (this.series_Chart4_line.series as any)[4].data.push(brokerage_rank[4]);
        (this.series_Chart4_line.xAxis as any).data.push(selected_date[item]);
      }
      this.chart4_max = Math.max(...chart4_max_r1);
      this.chart4_max += 5;
      (this.series_Chart4_radar.radar as any).indicator[0].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[1].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[2].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[3].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[4].max = this.chart4_max;
      this.flag_chart4 = true;
      for (let item in selected_date) {
        res_chart5 = await this.getData.get_Chart5(selected_date[item]).toPromise();
        let brokerage_rank = [];
        brokerage_rank[0] = res_chart5.beI_Physical_Rank;
        brokerage_rank[1] = res_chart5.beI_Moshtaghe_Rank;
        brokerage_rank[2] = res_chart5.beI_Other_Rank;
        brokerage_rank[3] = res_chart5.beI_Brokerage_Value_Rank;
        chart5_max_r1.push(Math.max(...brokerage_rank));
        let brokerage_value = [];
        brokerage_value[0] = res_chart5.beI_Physical;
        brokerage_value[1] = res_chart5.beI_Moshtaghe;
        brokerage_value[2] = res_chart5.beI_Other;
        brokerage_value[3] = res_chart5.beI_Brokerage_Value;
        let total_value = [];
        total_value[0] = res_chart5.beI_Physical_Total;
        total_value[1] = res_chart5.beI_Moshtaghe_Total;
        total_value[2] = res_chart5.beI_Other_Total;
        total_value[3] = res_chart5.beI_Total_Value;
        (this.series_Chart5_radar.series as any)[0].data.push({name:selected_date[item], value:brokerage_rank});
        (this.series_Chart5_radar.legend as any).data.push(selected_date[item]);
        (this.series_Chart5_bar.series as any).push({name:selected_date[item],type:'bar',data:brokerage_value,color:this.series_color[item],label:this.label});
        (this.series_Chart5_bar.legend as any).data.push(selected_date[item]);
        (this.series_Chart5_bar_total.series as any).push({name:selected_date[item],type:'bar',data:total_value,color:this.series_color[item],label:this.label});
        (this.series_Chart5_bar_total.legend as any).data.push(selected_date[item]);
        (this.series_Chart5_line.series as any)[0].data.push(brokerage_rank[0]);
        (this.series_Chart5_line.series as any)[1].data.push(brokerage_rank[1]);
        (this.series_Chart5_line.series as any)[2].data.push(brokerage_rank[2]);
        (this.series_Chart5_line.series as any)[3].data.push(brokerage_rank[3]);
        (this.series_Chart5_line.xAxis as any).data.push(selected_date[item]);
      }
      this.chart5_max = Math.max(...chart5_max_r1);
      this.chart5_max += 5;
      (this.series_Chart5_radar.radar as any).indicator[0].max = this.chart5_max;
      (this.series_Chart5_radar.radar as any).indicator[1].max = this.chart5_max;
      (this.series_Chart5_radar.radar as any).indicator[2].max = this.chart5_max;
      (this.series_Chart5_radar.radar as any).indicator[3].max = this.chart5_max;
      this.flag_chart5 = true;
    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      if (this.getBroker() != 'Khobregan'){
        if (this.selected_date.length > 4){
          this.toast.warning({ detail: "Warning", summary: 'Cant Select More Than 5 Date!', duration: 1500, position: 'topRight' });
          const index = this.selected_date.indexOf(item);
          this.selected_date.splice(index, 1);
        }
      }
      if (!this.selected_date.includes(item)) {
        this.selected_date.push(item);
      }
    } else {
      const index = this.selected_date.indexOf(item);
      if (index > -1) {
        this.selected_date.splice(index, 1);
      }
    }
  }

  getBroker(){
    return this.auth.getUserBroker();
  }

  @ViewChildren('select_date, view, totals, bob, fi, bki, bei') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    console.log(sectionName);
    let section:any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected readonly Object = Object;
  protected readonly last = last;
}
