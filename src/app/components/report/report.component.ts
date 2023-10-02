import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingsService } from 'src/app/core/services/bookings.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  range!: FormGroup;
  reports: any = [];
  extraTime: any = [];
  fileName= 'ExcelSheet.xlsx';
  types: string[] = ['In house', 'Spa Party', 'Home Service'];
  type: any = 'In house';
  constructor(
    private fb: FormBuilder,
    private book: BookingsService,
    private main: MainService) { }

  ngOnInit(): void {
    this.getExtraTime(this.main.getCurrentUserBranch());     
    this.range = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  getExtraTime(b: any){
    this.main.getExtraTime({data: b}).subscribe((res: any) =>{      
        this.extraTime = res.success ? res.response[0].et_time : [];
    })
  }

  exportexcel(): void  {
    let date_name = moment(this.range.get('start')?.value).format('MMM YYYY');
    let file_name =  'DSR - NORTH ' + date_name + '.xlsx';
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, file_name);
 
  }

  reset(){
    this.range.get('start')?.setValue('');
    this.range.get('end')?.setValue('');
    this.reports = [];
  }

  search(){
    let type = this.type === "in house" ? 1 : this.type === "Spa Party" ? 4 : this.type === "Home Service" ? 5 : 1;
    if(this.range.valid){
      this.book.generateReports({data: this.range.getRawValue(), type: type}).subscribe((result: any) =>{
        if(result.success){
          result.response[0].forEach((element: any) => {
            element.booked_date_excel = moment(element.booked_date).format("MM/DD/YYYY");         
          });
          this.reports = result.success ? result.response : [];
        }
      });
    }
  }

  print(){
    let printContent: any = document.getElementById("reportsID");
    let WindowPrt: any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0,scale=10');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}
