import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgToastService} from "ng-angular-popup";
import {TransportToSmartService} from "../../../../services/transport-to-smart.service";

@Component({
  selector: 'app-list-table',
  standalone: true,
    imports: [
        DatePipe,
        MatCellDef,
        MatColumnDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatPaginator,
        MatProgressSpinner,
        MatRow, MatRowDef, MatTable, NgIf, MatTableModule, MatPaginatorModule, NgForOf
    ],
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.scss'
})
export class ListTableComponent implements AfterViewInit {
  constructor(private getData:TransportToSmartService, private toast:NgToastService) {}
  displayedColumns: string[] = ['کد', 'تماس گیرنده', 'مشتری', 'توضیحات','تاریخ','میزان رضایت','نتیجه تماس'];
  dataSource:MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  @Input() data:PeriodicElement[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  series_ticket_detail = {
    from: "",
    to: "",
    description: "",
    createdon: "",
    phonenumber: "",
    nationalCode: "",
    resultOfCall: "",
    customerSatisfaction: "",
    reasons: []
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
