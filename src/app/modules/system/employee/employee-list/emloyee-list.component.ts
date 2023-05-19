import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Contract } from 'src/app/data/model/request/contract';
import { EmployeeRequest } from 'src/app/data/model/request/EmployeeRequest';
import { ListDepartmentsRequest } from 'src/app/data/model/request/ListDepartmentsRequest';
import { EmployeeService } from 'src/app/data/service/employee/employee.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
@Component({
  selector: 'app-emloyee-list',
  templateUrl: './emloyee-list.component.html',
  styleUrls: ['./emloyee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  public columns: any[];

  public employees: [];

  public totalRecord: any;

  public pageSize = 20;

  public searchForm: FormGroup;

  public pageLinkSize = 10;

  public position: string;

  public keySearch: any;

  public contractSearch: any;

  public departmentSearch: any;

  public positionSearch: any;

  public curentPage: number = 1;

  public isHr: boolean = false;

  public isLeader: boolean = false;

  public employeeSearch: any;

  public recordStart: any;

  public recordEnd: any;

  public LastcurentPage: any = 1;

  public inWorking: boolean;

  public active: boolean = true;

  public innerWidth: any;

  public tableScrollHeight = "70vh";

  public flag: boolean = true;
  public ctr: Contract[] = [];

  public excelFlag: boolean = false;
  public excelList: any[] = [];
  public excelTableHeader: any[] = [];

  public department: ListDepartmentsRequest[] = [];
  public contract: EmployeeRequest[] = [];

  public screenWidth:any;
  public mobileScreen: boolean = false;

  public paginatorDisplay: boolean = true;
  public searchFlag: boolean = false;
  selectedContract = '';
  selectedDepartment = '';
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  constructor(
    private routerpage: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private token: TokenStorageService,
    private deviceDetector : DeviceDetectorService
  ) {
    this.ctr = [
      { id: 1, name: 'Chính thức' },
      { id: 2, name: 'Thử việc' },
      { id: 3, name: 'Freelance' },
      { id: 4, name: 'Thực tập' },
    ];
    this.screenWidth = window.outerWidth;
    this.mobileScreen = deviceDetector.isMobile();
  }

  ngOnInit(): void {
    this.pageLinkSize = this.mobileScreen?3:10;
    if (!this.searchFlag) {
      const paramPageRoute = this.routerpage.snapshot.paramMap.get('currentpage');
      this.curentPage = Number(paramPageRoute);
    }
    else {
      this.searchFlag = false;
    }
    this.innerWidth = window.innerWidth;
    this.changePageSizeRes(this.innerWidth);
    this.loadLocalSearchValues();
    this.searchForm = new FormGroup({
      key: new FormControl(),
      contract: new FormControl(),
      department: new FormControl(),
      position: new FormControl(),
    });
    if (this.keySearch) {
      this.searchForm.controls['key'].patchValue(this.keySearch);
    }
    if (this.departmentSearch) {
      this.searchForm.controls['department'].patchValue(this.departmentSearch);
    }
    if (this.contractSearch) {
      this.searchForm.controls['contract'].patchValue(this.contractSearch);
    }
    if (this.positionSearch) {
      this.searchForm.controls['position'].patchValue(this.positionSearch);
    }
    this.initCheck();
    this.initTableHeader();
    this.initExcelTableHeader();
    this.getpartmentcontract();
    // this.getAllEmpl()
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth
  }
  
  ngOnDestroy(): void {
    // remove local storage for searchValues when navigate to another screen
    if (!this.router.url.includes('/employee/edit')) {
      this.removeLocalSearchValues();
    }
  }

  initTableHeader() {
    this.columns = [
      { header: this.isLeader?'Chi Tiết':'Sửa', width: this.mobileScreen?'8vh':'4%' },
      { header: 'Mã NV', width: this.mobileScreen?'10vh':'8%' },
      { header: 'Họ Tên', width: this.mobileScreen?'20vh':'14%' },
      { header: 'Email', width: this.mobileScreen?'20vh':'14%' },
      { header: 'Giới Tính', width: this.mobileScreen?'10vh':'5%' },
      { header: 'Hợp Đồng', width: this.mobileScreen?'10vh':'9%' },
      { header: 'Thâm Niên', width: this.mobileScreen?'20vh':'10%' },
      { header: 'Điện Thoại', width: this.mobileScreen?'15vh':'9%' },
      { header: 'Ngày Sinh', width: this.mobileScreen?'15vh':'8%' },
      { header: 'Phòng Ban', width: this.mobileScreen?'10vh':'8%' },
      { header: 'Công việc', width: this.mobileScreen?'10vh':'5%' },
    ];
    if(!this.isLeader){
      this.columns.push({header: 'Xóa', width: this.mobileScreen?'10vh':'3%'});
    }
    this.getEmployee(true);
  }

  initExcelTableHeader() {
    this.excelTableHeader = [
      { header: 'Mã NV' },
      { header: 'Họ Tên' },
      { header: 'Email' },
      { header: 'Xóa' }
    ]
  }

  getEmployee(inWorking: boolean) {
    this.active = inWorking;
    this.inWorking = inWorking;
    this.searchForm.value.pageSize = this.pageSize;
    this.flag = JSON.parse(localStorage.getItem('flag'));
    this.searchForm.value.pageNo = this.curentPage;
    this.employeeSearch = this.searchForm.value;
    this.employeeSearch.isLeader = this.isLeader;
    this.employeeSearch.inWorking = inWorking;
    this.employeeService.getAllEmployees(this.employeeSearch).subscribe(
      (data: any) => {
        if (data.status === ConstantsCommon.HTTP_STATUS_200) {
          this.employees = data.items.items;
          this.totalRecord = data.items.totalItems;
          if (!this.flag && this.paginator) {
            this.paginator.totalRecords = this.totalRecord;
            this.paginator.changePage(this.curentPage - 1);
          }
          localStorage.setItem('flag', JSON.stringify(true));
        }
        else {
          this.paginatorDisplay = false;;
          this.messageService.add({
            severity: 'error',
            detail: data.message
          });
        }
        if (this.curentPage === 1) {
          this.recordEnd = this.totalRecord > 20 ? 20 : this.totalRecord;
        }
        if (this.curentPage == this.LastcurentPage) {
          this.recordEnd = this.totalRecord;
        }
        this.updateRecordSummary();
      },
      (err) => {
        this.employees = [];
        this.totalRecord = 0;
      }
    );
  }
  // calculate seniority of an employee
  calculateSeniority(entryDate: any): string {
    let fromDate = new Date(entryDate);
    let toDate = new Date();

    let dateDiff = new Date(toDate.getFullYear() - fromDate.getFullYear(), toDate.getMonth() - fromDate.getMonth(), toDate.getDate() - fromDate.getDate());
    let yearNumbers = dateDiff.getFullYear() - 1900;
    let monthNumbers = dateDiff.getMonth();
    let dayNumbers = dateDiff.getDate()

    let result = "";
    result += (yearNumbers === 0 ? '' : yearNumbers + ' năm ');
    result += (monthNumbers === 0 ? '' : monthNumbers + ' tháng ');
    result += (dayNumbers === 0 ? '' : dayNumbers + ' ngày');

    return result;
  }

  onSearch() {
    this.curentPage = 1;
    this.paginator.changePage(0);
    this.searchFlag = true;
    this.getEmployee(this.inWorking);

  }

  initCheck() {
    let rules = this.token.getUser()?.roles;
    let isLoggedIn = !!this.token.getToken();
    if (isLoggedIn) {
      this.isLeader =
        rules.indexOf(eRole.LEADER) >= 0 && rules.indexOf(eRole.HR) < 0
          ? true
          : false;
    }
  }
  deleteEmployee(id: any) {
    this.employeeService.deleteEmployee(id).subscribe(
      (data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.getEmployee(this.inWorking);
          this.showSuccess();
        } else {
          this.showError();
        }
      },
      (err) => {
        this.showError();
      }
    );
  }

  confirm(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: 'Xác nhận xóa',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Từ chối',
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.deleteEmployee(id);
      },
      key: 'positionDialog',
    });
  }

  gotoEdit(id: any) {
    if (typeof Storage !== undefined) {
      localStorage.setItem('employees', JSON.stringify(this.curentPage));
      localStorage.setItem('keySearch', JSON.stringify(this.searchForm.value.key));
      localStorage.setItem('contractSearch', JSON.stringify(this.searchForm.controls['contract'].value));
      localStorage.setItem('departmentSearch', JSON.stringify(this.searchForm.controls['department'].value));
      localStorage.setItem('positionSearch', JSON.stringify(this.searchForm.controls['position'].value));
      localStorage.setItem('flag', JSON.stringify(this.flag));

      this.flag = JSON.parse(localStorage.getItem('flag'));
    }
    this.router.navigate(['employee/edit/' + id + '/' + this.curentPage]);
  }
  // load local searchValues to form control
  loadLocalSearchValues() {
    this.keySearch = localStorage.getItem('keySearch') !== null && localStorage.getItem('keySearch') !== 'null' ?
      String(localStorage.getItem('keySearch')).replace('"', '').replace('"', '') : null;
    this.contractSearch = localStorage.getItem('contractSearch') !== 'null' ? Number(localStorage.getItem('contractSearch')) : null;
    this.departmentSearch = localStorage.getItem('departmentSearch') !== 'null' ? Number(localStorage.getItem('departmentSearch')) : null;
    this.positionSearch = localStorage.getItem('positionSearch') !== null && localStorage.getItem('positionSearch') !== 'null' ?
      String(localStorage.getItem('positionSearch')).replace('"', '').replace('"', '') : null;
  }
  // remove local searchValues
  removeLocalSearchValues() {
    localStorage.removeItem('keySearch');
    localStorage.removeItem('contractSearch');
    localStorage.removeItem('departmentSearch');
    localStorage.removeItem('positionSearch');
  }
  pageClick(event: any) {
    this.curentPage = event.page + 1;
    this.getEmployee(this.inWorking);
  }

  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.curentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd =
          this.recordEnd - (this.pageSize - this.employees.length);
      }
    } else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }

  showSuccess() {
    this.messageService.add({
      severity: 'info',
      detail: MessageValidate.MES_SUCCESS,
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      detail: MessageValidate.MES_ERROR,
    });
  }
  getpartmentcontract() {
    this.employeeService.getListDepartment().subscribe((response) => {
      this.department = response.items;
    });
  }
  switchInWorking(inWorking: boolean) {
    this.curentPage = 1;
    this.getEmployee(inWorking);
  }

  // change pageSize according to screen resolution
  changePageSizeRes(res: any): void {
    if (res <= 1390) { this.pageSize = 13; }
    else if (res < 1700) { this.pageSize = 15; }
    else { this.pageSize = 18; this.pageLinkSize = 18 }
  }
  get getCheckboxStatus(): boolean {
    return true;
  }

  // Manage excel exporting
  cancelExcel(event: any, pickUpListExcel: any) {
    this.excelList = [];
    this.excelFlag = false;
    pickUpListExcel.hide(event);
  }
  addToExcelList(employee: any, event: any, pickUpListExcel: any) {
    if (this.excelFlag) {
      if (this.excelList.find(item => item.id === employee.id) == null) {
        this.excelList.push(employee);
      }
    }
  }
  addAllToExcelList() {
    if (this.excelFlag) {
      if (this.employees.length > 0 && this.employees != null) {
        this.employees.forEach((employee: any) => {
          if (this.excelList.find(item => item.id === employee.id) == null) {
            this.excelList.push(employee);
          }
        });
      }
    }
  }
  removeFromExcelList(id: number) {
    this.excelList = this.excelList.filter(item => item.id !== id);
  }
  exportExcel(exportAllFlag: boolean) {
    if (this.excelList.length <= 0 && !exportAllFlag) {
      this.messageService.add({
        severity: 'warning',
        detail: ConstantsCommon.RECORD_EMPTY,
      });
    }
    else {
      let idList = this.excelList.map(({ id }) => id);
      let listSearch: { idList: any; searchValues: any } = {} as any;
      listSearch.idList = idList;
      if(exportAllFlag){
        this.searchForm.value.pageSize = 99999;
        this.searchForm.value.pageNo = this.curentPage;
        this.flag = JSON.parse(localStorage.getItem('flag'));
        listSearch.searchValues = this.searchForm.value
      }
      this.employeeService.exportExcel(listSearch, exportAllFlag).subscribe((response: any) => {
        let file = new Blob([response], { type: 'application/vnd.ms-excel' });
        let name = "employee_information"
        let EXCEL_EXTENSION = '.xlsx';
        FileSaver.saveAs(file, name + EXCEL_EXTENSION);
      })
    }
  }
}
