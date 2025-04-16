import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Menu1Component} from "../../Template/menu1/menu1.component";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {NgToastService} from "ng-angular-popup";
import {BrokerageService} from "../../../services/brokerage.service";
import {EChartsOption} from "echarts";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-brokerage-cmp',
    imports: [
        DashboardContactComponent,
        DashboardSidebarComponent,
        MatProgressSpinner,
        MatTab,
        MatTabGroup,
        Menu1Component,
        NgForOf,
        NgIf,
        NgxEchartsDirective,
        DecimalPipe
    ],
    providers: [DatePipe],
    templateUrl: './brokerage-cmp.html',
    styleUrl: './brokerage-cmp.scss'
})
export class BrokerageCmp implements OnInit {
  public constructor(private auth:AuthService, private router:Router, private toast:NgToastService, private getData:BrokerageService) {}
  series_date:any = [];
  years:any = [];
  selected_date:any = [];
  last6_date:any = [];
  last6_top:any = [];
  all_brokers:any[] = [];
  comparison_list:any[] = [];
  protected flag_date:boolean=false;
  protected flag_all_brokers:boolean=false;
  protected flag_top6:boolean=false;
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
  series_color = ['#3ebeed','#EC7063','#004e75','#f1c40f','#7f6487','#42b3a1'];
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
    yAxis: {type: 'value'},
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
    yAxis: {type: 'value'},
    series: [{type: 'bar',name:'',data:[],color:'#3ebeed'}]
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

  async ngOnInit(){
    if(this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin"){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }
    let res_brokerage_name = await this.getData.Get_Brokerage_Name().toPromise();
    this.brokerage_name = res_brokerage_name[0].name;
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
    for (let i = 1; i <= 6; i++)
      this.last6_date.push(this.series_date[this.series_date.length - i]);
    for (let date of this.last6_date) {
      this.last6_top.push(await this.getData.get_Top_Brokers(date).toPromise());
    }
    this.flag_top6 = true;
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
    if (this.series_date.length >= 1){
      this.selected_date.push(this.series_date[this.series_date.length-1]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
    this.onShowAllBrokers(this.selected_date);
  }

  async do(selected_date:string){
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
    (this.series_Chart2_radar.series as any)[0].data = [];
    (this.series_Chart2_radar.legend as any).data = [];
    (this.series_Chart2_bar.series as any)=[];
    (this.series_Chart2_bar.legend as any).data = [];
    (this.series_Chart2_bar_total.series as any)=[];
    (this.series_Chart2_bar_total.legend as any).data = [];
    (this.series_Chart3_radar.series as any)[0].data = [];
    (this.series_Chart3_radar.legend as any).data = [];
    (this.series_Chart3_bar.series as any)=[];
    (this.series_Chart3_bar.legend as any).data = [];
    (this.series_Chart3_bar_total.series as any)=[];
    (this.series_Chart3_bar_total.legend as any).data = [];
    (this.series_Chart4_radar.series as any)[0].data = [];
    (this.series_Chart4_radar.legend as any).data = [];
    (this.series_Chart4_bar.series as any)=[];
    (this.series_Chart4_bar.legend as any).data = [];
    (this.series_Chart4_bar_total.series as any)=[];
    (this.series_Chart4_bar_total.legend as any).data = [];
    (this.series_Chart5_radar.series as any)[0].data = [];
    (this.series_Chart5_radar.legend as any).data = [];
    (this.series_Chart5_bar.series as any)=[];
    (this.series_Chart5_bar.legend as any).data = [];
    (this.series_Chart5_bar_total.series as any)=[];
    (this.series_Chart5_bar_total.legend as any).data = [];
    try {
      let res_totals = [];
      let chart1_max_r1 = [];
      let chart1_max_r1_CMP = [];
      let chart2_max_r1 = [];
      let chart2_max_r1_CMP = [];
      let chart3_max_r1 = [];
      let chart3_max_r1_CMP = [];
      let chart4_max_r1 = [];
      let chart4_max_r1_CMP = [];
      let chart5_max_r1 = [];
      let chart5_max_r1_CMP = [];
      // Self Broker --------------------------------------------------------------------------
      let res_chart1 = await this.getData.get_Chart1(selected_date).toPromise();
      let brokerage_rank_1 = [];
      brokerage_rank_1[0] = res_chart1.bobT_Brokerage_Rank;
      brokerage_rank_1[1] = res_chart1.fI_Brokerage_Rank;
      brokerage_rank_1[2] = res_chart1.bobT_AND_FI_Brokerage_Rank;
      brokerage_rank_1[3] = res_chart1.bkI_Brokerage_Rank;
      brokerage_rank_1[4] = res_chart1.beI_Brokerage_Rank;
      brokerage_rank_1[5] = res_chart1.all_Brokerage_Rank;
      chart1_max_r1.push(Math.max(...brokerage_rank_1));
      let brokerage_value_1 = [];
      brokerage_value_1[0] = res_chart1.bobT_Brokerage_Value;
      brokerage_value_1[1] = res_chart1.fI_Brokerage_Value;
      brokerage_value_1[2] = res_chart1.bobT_AND_FI_Brokerage_Value;
      brokerage_value_1[3] = res_chart1.bkI_Brokerage_Value;
      brokerage_value_1[4] = res_chart1.beI_Brokerage_Value;
      brokerage_value_1[5] = res_chart1.all_Brokerage_Value;
      let total_value_1 = [];
      total_value_1[0] = res_chart1.bobT_Total_Value;
      total_value_1[1] = res_chart1.fI_Total_Value;
      total_value_1[2] = res_chart1.bobT_AND_FI_Total_Value;
      total_value_1[3] = res_chart1.bkI_Total_Value;
      total_value_1[4] = res_chart1.beI_Total_Value;
      total_value_1[5] = res_chart1.all_Total_Value;
      (this.series_Chart1_radar.series as any)[0].data.push({name:this.brokerage_name, value:brokerage_rank_1});
      (this.series_Chart1_radar.legend as any).data.push(this.brokerage_name);
      (this.series_Chart1_bar.series as any).push({name:this.brokerage_name,type:'bar',data:brokerage_value_1,color:this.series_color[0],label:this.label});
      (this.series_Chart1_bar.legend as any).data.push(this.brokerage_name);
      // CMP Broker --------------------------------------------------------------------------
      for (const item of this.comparison_list)
      {
        let res_chart1_CMP = await this.getData.get_Chart1_CMP(selected_date,item.id).toPromise();
        let brokerage_rank_CMP = [];
        brokerage_rank_CMP[0] = res_chart1_CMP.bobT_Brokerage_Rank;
        brokerage_rank_CMP[1] = res_chart1_CMP.fI_Brokerage_Rank;
        brokerage_rank_CMP[2] = res_chart1_CMP.bobT_AND_FI_Brokerage_Rank;
        brokerage_rank_CMP[3] = res_chart1_CMP.bkI_Brokerage_Rank;
        brokerage_rank_CMP[4] = res_chart1_CMP.beI_Brokerage_Rank;
        brokerage_rank_CMP[5] = res_chart1_CMP.all_Brokerage_Rank;
        chart1_max_r1_CMP.push(Math.max(...brokerage_rank_CMP));
        let brokerage_value_CMP = [];
        brokerage_value_CMP[0] = res_chart1_CMP.bobT_Brokerage_Value;
        brokerage_value_CMP[1] = res_chart1_CMP.fI_Brokerage_Value;
        brokerage_value_CMP[2] = res_chart1_CMP.bobT_AND_FI_Brokerage_Value;
        brokerage_value_CMP[3] = res_chart1_CMP.bkI_Brokerage_Value;
        brokerage_value_CMP[4] = res_chart1_CMP.beI_Brokerage_Value;
        brokerage_value_CMP[5] = res_chart1_CMP.all_Brokerage_Value;
        (this.series_Chart1_radar.series as any)[0].data.push({name:item.name, value:brokerage_rank_CMP});
        (this.series_Chart1_radar.legend as any).data.push(item.name);
        (this.series_Chart1_bar.series as any).push({name:item.name,type:'bar',data:brokerage_value_CMP,color:this.series_color[item]});
        (this.series_Chart1_bar.legend as any).data.push(item.name);
      }
      (this.series_Chart1_bar_total.series as any).push({name:selected_date[0],type:'bar',data:total_value_1,color:this.series_color[5],label:this.label});
      (this.series_Chart1_bar_total.legend as any).data.push(selected_date[0]);
      res_totals = await this.getData.get_totals(selected_date).toPromise();
      res_totals.name = this.brokerage_name;
      this.series_totals.push(res_totals);
      for (const item of this.comparison_list){
        let res_totals_CMP = await this.getData.get_totals_CMP(selected_date,item.id).toPromise();
        res_totals_CMP.name = item.name;
        this.series_totals.push(res_totals_CMP);
      }
      this.chart1_max = Math.max(...chart1_max_r1, ...chart1_max_r1_CMP);
      this.chart1_max += 5;
      (this.series_Chart1_radar.radar as any).indicator[0].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[1].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[2].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[3].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[4].max = this.chart1_max;
      (this.series_Chart1_radar.radar as any).indicator[5].max = this.chart1_max;
      this.flag_chart1 = true;
      this.flag_totals = true;
      // Self Broker --------------------------------------------------------------------------
      let res_chart2 = await this.getData.get_Chart2(selected_date).toPromise();
      let brokerage_rank_2 = [];
      brokerage_rank_2[0] = res_chart2.bobT_Oragh_Bedehi_Rank;
      brokerage_rank_2[1] = res_chart2.bobT_Moshtaghe_Rank;
      brokerage_rank_2[2] = res_chart2.bobT_Sarmaye_Herfei_Rank;
      brokerage_rank_2[3] = res_chart2.bobT_saham_Rank;
      brokerage_rank_2[4] = res_chart2.bobT_Brokerage_Rank;
      chart2_max_r1.push(Math.max(...brokerage_rank_2));
      let brokerage_value_2 = [];
      brokerage_value_2[0] = res_chart2.bobT_Oragh_Bedehi;
      brokerage_value_2[1] = res_chart2.bobT_Moshtaghe;
      brokerage_value_2[2] = res_chart2.bobT_Sarmaye_Herfei;
      brokerage_value_2[3] = res_chart2.bobT_saham;
      brokerage_value_2[4] = res_chart2.bobT_Brokerage_Value;
      let total_value_2 = [];
      total_value_2[0] = res_chart2.bobT_Oragh_Bedehi_Total;
      total_value_2[1] = res_chart2.bobT_Moshtaghe_Total;
      total_value_2[2] = res_chart2.bobT_Sarmaye_Herfei_Total;
      total_value_2[3] = res_chart2.bobT_saham_Total;
      total_value_2[4] = res_chart2.bobT_Total_Value;
      (this.series_Chart2_radar.series as any)[0].data.push({name:this.brokerage_name, value:brokerage_rank_2});
      (this.series_Chart2_radar.legend as any).data.push(this.brokerage_name);
      (this.series_Chart2_bar.series as any).push({name:this.brokerage_name,type:'bar',data:brokerage_value_2,color:this.series_color[0],label:this.label});
      (this.series_Chart2_bar.legend as any).data.push(this.brokerage_name);
      // CMP Broker --------------------------------------------------------------------------
      for (const item of this.comparison_list) {
        let res_chart2_CMP = await this.getData.get_Chart2_CMP(selected_date,item.id).toPromise();
        let brokerage_rank_2_CMP = [];
        brokerage_rank_2_CMP[0] = res_chart2_CMP.bobT_Oragh_Bedehi_Rank;
        brokerage_rank_2_CMP[1] = res_chart2_CMP.bobT_Moshtaghe_Rank;
        brokerage_rank_2_CMP[2] = res_chart2_CMP.bobT_Sarmaye_Herfei_Rank;
        brokerage_rank_2_CMP[3] = res_chart2_CMP.bobT_saham_Rank;
        brokerage_rank_2_CMP[4] = res_chart2_CMP.bobT_Brokerage_Rank;
        chart2_max_r1_CMP.push(Math.max(...brokerage_rank_2_CMP));
        let brokerage_value_2_CMP = [];
        brokerage_value_2_CMP[0] = res_chart2_CMP.bobT_Oragh_Bedehi;
        brokerage_value_2_CMP[1] = res_chart2_CMP.bobT_Moshtaghe;
        brokerage_value_2_CMP[2] = res_chart2_CMP.bobT_Sarmaye_Herfei;
        brokerage_value_2_CMP[3] = res_chart2_CMP.bobT_saham;
        brokerage_value_2_CMP[4] = res_chart2_CMP.bobT_Brokerage_Value;
        (this.series_Chart2_radar.series as any)[0].data.push({name:item.name, value:brokerage_rank_2_CMP});
        (this.series_Chart2_radar.legend as any).data.push(item.name);
        (this.series_Chart2_bar.series as any).push({name:item.name,type:'bar',data:brokerage_value_2_CMP,color:this.series_color[item]});
        (this.series_Chart2_bar.legend as any).data.push(item.name);
      }
      (this.series_Chart2_bar_total.series as any).push({name:selected_date[0],type:'bar',data:total_value_2,color:this.series_color[5],label:this.label});
      (this.series_Chart2_bar_total.legend as any).data.push(selected_date[0]);

      this.chart2_max = Math.max(...chart2_max_r1, ...chart2_max_r1_CMP);
      this.chart2_max += 5;
      (this.series_Chart2_radar.radar as any).indicator[0].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[1].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[2].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[3].max = this.chart2_max;
      (this.series_Chart2_radar.radar as any).indicator[4].max = this.chart2_max;
      this.flag_chart2 = true;
      // Self Broker --------------------------------------------------------------------------
      let res_chart3 = await this.getData.get_Chart3(selected_date).toPromise();
      let brokerage_rank_3 = [];
      brokerage_rank_3[0] = res_chart3.fI_Brokerage_Station_Rank;
      brokerage_rank_3[1] = res_chart3.fI_Online_Normal_Rank;
      brokerage_rank_3[2] = res_chart3.fI_Online_Group_Rank;
      brokerage_rank_3[3] = res_chart3.fI_Online_Other_Rank;
      brokerage_rank_3[4] = res_chart3.fI_Brokerage_Value_Rank;
      chart3_max_r1.push(Math.max(...brokerage_rank_3));
      let brokerage_value_3 = [];
      brokerage_value_3[0] = res_chart3.fI_Brokerage_Station;
      brokerage_value_3[1] = res_chart3.fI_Online_Normal;
      brokerage_value_3[2] = res_chart3.fI_Online_Group;
      brokerage_value_3[3] = res_chart3.fI_Online_Other;
      brokerage_value_3[4] = res_chart3.fI_Brokerage_Value;
      let total_value_3 = [];
      total_value_3[0] = res_chart3.fI_Brokerage_Station_Total;
      total_value_3[1] = res_chart3.fI_Online_Normal_Total;
      total_value_3[2] = res_chart3.fI_Online_Group_Total;
      total_value_3[3] = res_chart3.fI_Online_Other_Total;
      total_value_3[4] = res_chart3.fI_Total_Value;
      (this.series_Chart3_radar.series as any)[0].data.push({name:this.brokerage_name, value:brokerage_rank_3});
      (this.series_Chart3_radar.legend as any).data.push(this.brokerage_name);
      (this.series_Chart3_bar.series as any).push({name:this.brokerage_name,type:'bar',data:brokerage_value_3,color:this.series_color[0],label:this.label});
      (this.series_Chart3_bar.legend as any).data.push(this.brokerage_name);
      // CMP Broker --------------------------------------------------------------------------
      for (const item of this.comparison_list) {
        let res_chart3_CMP = await this.getData.get_Chart3_CMP(selected_date,item.id).toPromise();
        let brokerage_rank_3_CMP = [];
        brokerage_rank_3_CMP[0] = res_chart3_CMP.fI_Brokerage_Station_Rank;
        brokerage_rank_3_CMP[1] = res_chart3_CMP.fI_Online_Normal_Rank;
        brokerage_rank_3_CMP[2] = res_chart3_CMP.fI_Online_Group_Rank;
        brokerage_rank_3_CMP[3] = res_chart3_CMP.fI_Online_Other_Rank;
        brokerage_rank_3_CMP[4] = res_chart3_CMP.fI_Brokerage_Value_Rank;
        chart3_max_r1_CMP.push(Math.max(...brokerage_rank_3_CMP));
        let brokerage_value_3_CMP = [];
        brokerage_value_3_CMP[0] = res_chart3_CMP.fI_Brokerage_Station;
        brokerage_value_3_CMP[1] = res_chart3_CMP.fI_Online_Normal;
        brokerage_value_3_CMP[2] = res_chart3_CMP.fI_Online_Group;
        brokerage_value_3_CMP[3] = res_chart3_CMP.fI_Online_Other;
        brokerage_value_3_CMP[4] = res_chart3_CMP.fI_Brokerage_Value;
        (this.series_Chart3_radar.series as any)[0].data.push({name:item.name, value:brokerage_rank_3_CMP});
        (this.series_Chart3_radar.legend as any).data.push(item.name);
        (this.series_Chart3_bar.series as any).push({name:item.name,type:'bar',data:brokerage_value_3_CMP,color:this.series_color[item]});
        (this.series_Chart3_bar.legend as any).data.push(item.name);
      }

      (this.series_Chart3_bar_total.series as any).push({name:selected_date[0],type:'bar',data:total_value_3,color:this.series_color[5],label:this.label});
      (this.series_Chart3_bar_total.legend as any).data.push(selected_date[0]);

      this.chart3_max = Math.max(...chart3_max_r1, ...chart3_max_r1_CMP);
      this.chart3_max += 5;
      (this.series_Chart3_radar.radar as any).indicator[0].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[1].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[2].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[3].max = this.chart3_max;
      (this.series_Chart3_radar.radar as any).indicator[4].max = this.chart3_max;
      this.flag_chart3 = true;
      // Self Broker --------------------------------------------------------------------------
      let res_chart4 = await this.getData.get_Chart4(selected_date).toPromise();
      let brokerage_rank_4 = [];
      brokerage_rank_4[0] = res_chart4.bkI_Physical_Rank;
      brokerage_rank_4[1] = res_chart4.bkI_Self_Rank;
      brokerage_rank_4[2] = res_chart4.bkI_Ati_Rank;
      brokerage_rank_4[3] = res_chart4.bkI_Ekhtiar_Rank;
      brokerage_rank_4[4] = res_chart4.bkI_Brokerage_Value_Rank;
      chart4_max_r1.push(Math.max(...brokerage_rank_4));
      let brokerage_value_4 = [];
      brokerage_value_4[0] = res_chart4.bkI_Physical;
      brokerage_value_4[1] = res_chart4.bkI_Self;
      brokerage_value_4[2] = res_chart4.bkI_Ati;
      brokerage_value_4[3] = res_chart4.bkI_Ekhtiar;
      brokerage_value_4[4] = res_chart4.bkI_Brokerage_Value;
      let total_value_4 = [];
      total_value_4[0] = res_chart4.bkI_Physical_Total;
      total_value_4[1] = res_chart4.bkI_Self_Total;
      total_value_4[2] = res_chart4.bkI_Ati_Total;
      total_value_4[3] = res_chart4.bkI_Ekhtiar_Total;
      total_value_4[4] = res_chart4.bkI_Total_Value;
      (this.series_Chart4_radar.series as any)[0].data.push({name:this.brokerage_name, value:brokerage_rank_4});
      (this.series_Chart4_radar.legend as any).data.push(this.brokerage_name);
      (this.series_Chart4_bar.series as any).push({name:this.brokerage_name,type:'bar',data:brokerage_value_4,color:this.series_color[0],label:this.label});
      (this.series_Chart4_bar.legend as any).data.push(this.brokerage_name);
      // CMP Broker --------------------------------------------------------------------------
      for (const item of this.comparison_list) {
        let res_chart4_CMP = await this.getData.get_Chart4_CMP(selected_date,item.id).toPromise();
        let brokerage_rank_4_CMP = [];
        brokerage_rank_4_CMP[0] = res_chart4_CMP.bkI_Physical_Rank;
        brokerage_rank_4_CMP[1] = res_chart4_CMP.bkI_Self_Rank;
        brokerage_rank_4_CMP[2] = res_chart4_CMP.bkI_Ati_Rank;
        brokerage_rank_4_CMP[3] = res_chart4_CMP.bkI_Ekhtiar_Rank;
        brokerage_rank_4_CMP[4] = res_chart4_CMP.bkI_Brokerage_Value_Rank;
        chart4_max_r1_CMP.push(Math.max(...brokerage_rank_4_CMP));
        let brokerage_value_4_CMP = [];
        brokerage_value_4_CMP[0] = res_chart4_CMP.bkI_Physical;
        brokerage_value_4_CMP[1] = res_chart4_CMP.bkI_Self;
        brokerage_value_4_CMP[2] = res_chart4_CMP.bkI_Ati;
        brokerage_value_4_CMP[3] = res_chart4_CMP.bkI_Ekhtiar;
        brokerage_value_4_CMP[4] = res_chart4_CMP.bkI_Brokerage_Value;
        (this.series_Chart4_radar.series as any)[0].data.push({name:item.name, value:brokerage_rank_4_CMP});
        (this.series_Chart4_radar.legend as any).data.push(item.name);
        (this.series_Chart4_bar.series as any).push({name:item.name,type:'bar',data:brokerage_value_4_CMP,color:this.series_color[item]});
        (this.series_Chart4_bar.legend as any).data.push(item.name);
      }
      (this.series_Chart4_bar_total.series as any).push({name:selected_date[0],type:'bar',data:total_value_4,color:this.series_color[5],label:this.label});
      (this.series_Chart4_bar_total.legend as any).data.push(selected_date[0]);
      this.chart4_max = Math.max(...chart4_max_r1, ...chart4_max_r1_CMP);
      this.chart4_max += 5;
      (this.series_Chart4_radar.radar as any).indicator[0].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[1].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[2].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[3].max = this.chart4_max;
      (this.series_Chart4_radar.radar as any).indicator[4].max = this.chart4_max;
      this.flag_chart4 = true;
      // Self Broker --------------------------------------------------------------------------
      let res_chart5 = await this.getData.get_Chart5(selected_date).toPromise();
      let brokerage_rank_5 = [];
      brokerage_rank_5[0] = res_chart5.beI_Physical_Rank;
      brokerage_rank_5[1] = res_chart5.beI_Moshtaghe_Rank;
      brokerage_rank_5[2] = res_chart5.beI_Other_Rank;
      brokerage_rank_5[3] = res_chart5.beI_Brokerage_Value_Rank;
      chart5_max_r1.push(Math.max(...brokerage_rank_5));
      let brokerage_value_5 = [];
      brokerage_value_5[0] = res_chart5.beI_Physical;
      brokerage_value_5[1] = res_chart5.beI_Moshtaghe;
      brokerage_value_5[2] = res_chart5.beI_Other;
      brokerage_value_5[3] = res_chart5.beI_Brokerage_Value;
      let total_value_5 = [];
      total_value_5[0] = res_chart5.beI_Physical_Total;
      total_value_5[1] = res_chart5.beI_Moshtaghe_Total;
      total_value_5[2] = res_chart5.beI_Other_Total;
      total_value_5[3] = res_chart5.beI_Total_Value;
      (this.series_Chart5_radar.series as any)[0].data.push({name:this.brokerage_name, value:brokerage_rank_5});
      (this.series_Chart5_radar.legend as any).data.push(this.brokerage_name);
      (this.series_Chart5_bar.series as any).push({name:this.brokerage_name,type:'bar',data:brokerage_value_5,color:this.series_color[0],label:this.label});
      (this.series_Chart5_bar.legend as any).data.push(this.brokerage_name);
      // CMP Broker --------------------------------------------------------------------------
      for (const item of this.comparison_list) {
        let res_chart5_CMP = await this.getData.get_Chart5_CMP(selected_date,item.id).toPromise();
        let brokerage_rank_5_CMP = [];
        brokerage_rank_5_CMP[0] = res_chart5_CMP.beI_Physical_Rank;
        brokerage_rank_5_CMP[1] = res_chart5_CMP.beI_Moshtaghe_Rank;
        brokerage_rank_5_CMP[2] = res_chart5_CMP.beI_Other_Rank;
        brokerage_rank_5_CMP[3] = res_chart5_CMP.beI_Brokerage_Value_Rank;
        chart5_max_r1_CMP.push(Math.max(...brokerage_rank_5_CMP));
        let brokerage_value_5_CMP = [];
        brokerage_value_5_CMP[0] = res_chart5_CMP.beI_Physical;
        brokerage_value_5_CMP[1] = res_chart5_CMP.beI_Moshtaghe;
        brokerage_value_5_CMP[2] = res_chart5_CMP.beI_Other;
        brokerage_value_5_CMP[3] = res_chart5_CMP.beI_Brokerage_Value;
        (this.series_Chart5_radar.series as any)[0].data.push({name:item.name, value:brokerage_rank_5_CMP});
        (this.series_Chart5_radar.legend as any).data.push(item.name);
        (this.series_Chart5_bar.series as any).push({name:item.name,type:'bar',data:brokerage_value_5_CMP,color:this.series_color[item]});
        (this.series_Chart5_bar.legend as any).data.push(item.name);
      }
      (this.series_Chart5_bar_total.series as any).push({name:selected_date[0],type:'bar',data:total_value_5,color:this.series_color[5],label:this.label});
      (this.series_Chart5_bar_total.legend as any).data.push(selected_date[0]);

      this.chart5_max = Math.max(...chart5_max_r1, ...chart5_max_r1_CMP);
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
      if (this.selected_date.length > 0){
        const index = this.selected_date.indexOf(item);
        this.selected_date.splice(index, 1);
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
    this.onShowAllBrokers(this.selected_date[0]);
    this.comparison_list = [];
  }

  async onShowAllBrokers(selected_date:string){
    this.flag_all_brokers = false;
    this.all_brokers = await this.getData.get_All_Brokers(selected_date).toPromise();
    const self_broker = this.all_brokers.find(t => t.name === this.brokerage_name);
    this.all_brokers = this.all_brokers.filter(t => t !== self_broker);
    this.flag_all_brokers = true;
  }

  addToComparison(broker: any) {
    if (this.comparison_list.length < 3) {
      const index = this.all_brokers.indexOf(broker);
      if (index !== -1) {
        this.all_brokers.splice(index, 1);
        this.comparison_list.push(broker);
      }
    } else {
      this.toast.warning({ detail: "هشدار", summary: 'نمیتوانید بیشتر از سه کارگزاری را در لیست مقایسه اضافه کنید!', duration: 1500, position: 'topRight' });
    }
  }

  removeFromComparison(broker: any) {
    const index = this.comparison_list.indexOf(broker);
    if (index !== -1) {
      this.comparison_list.splice(index, 1);
      this.all_brokers.push(broker);
    }
  }

  @ViewChildren('top, select_date, view, totals, bob, fi, bki, bei') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    console.log(sectionName);
    let section:any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected readonly Object = Object;
}
