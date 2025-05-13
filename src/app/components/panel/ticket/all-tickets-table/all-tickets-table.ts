import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe, NgIf} from "@angular/common";
import {TicketService} from "../../../../services/ticket.service";
import {NgToastService} from "ng-angular-popup";

@Component({
    selector: 'app-all-tickets-table',
    imports: [MatProgressSpinner, NgIf, MatTableModule, MatPaginatorModule, DatePipe],
    templateUrl: './all-tickets-table.html',
    styleUrl: './all-tickets-table.scss'
})
export class AllTicketsTable implements AfterViewInit {
  constructor(private getData:TicketService, private toast:NgToastService) {}
  displayedColumns: string[] = ['کد', 'ایجاد کننده تیکت', 'تاریخ ایجاد', 'تاریخ بررسی تیکت','شخص بررسی کننده تیکت','وضعیت'];
  dataSource:MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  @Input() data:PeriodicElement[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  series_ticket_detail = {
    owner: "",
    createdon: "",
    caseResolutionCreatedOn: "",
    caseResolutionsolver: "",
    status: "",
    customerName: "",
    phonecallReason: "",
    casetype: "",
    caseAutoNumber: ""
  };

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  async onRowClick(id: number) {
    this.flag_popup = true;
    this.series_ticket_detail = await this.getData.get_detail_table(id).toPromise();
    this.flag_popup_data = true;
  }
}

export interface PeriodicElement {
  id: string;
  owner: number;
  createdon: number;
  caseResolutionCreatedOn: string;
  caseResolutionsolver: string;
  status: string;
}


