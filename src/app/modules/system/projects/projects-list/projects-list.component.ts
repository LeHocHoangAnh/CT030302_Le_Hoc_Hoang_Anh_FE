import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ListProjectsRequest } from "src/app/data/model/request/ListProjectsRequest";
import { ProjectsService } from "src/app/data/service/projects-service";
import { ConstantsCommon } from "src/app/shared/constants.common";
import { MessageValidate } from "src/app/shared/message-validation";

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit{

  public totalRecord = 0;

  public pageSize = 20;

  public searchForm: FormGroup;

  public pageLinkSize = 20;

  public position: string;

  public keySearch: any;

  public curentPage = 1;

  public listProjects: any[];

  public projects: ListProjectsRequest = new ListProjectsRequest();

  public columns: any[];

  constructor(
    private projectsService: ProjectsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      codeProjects: new FormControl(),
      nameProjects: new FormControl()
    });
    if (this.keySearch) {
      this.searchForm.setValue({
        codeProjects: this.keySearch.codeProjects,
        nameProjects: this.keySearch.nameProjects,
      });
      this.curentPage = this.keySearch.pageNo;
    }
    this.initTableHeader();
  }

  initTableHeader() {
    this.columns = [
      { header: 'Sửa' },
      { header: 'Mã Dự Án' },
      { header: 'Tên Dự Án' },
      { header: 'Ngày Bắt Đầu' },
      { header: 'Ngày Kết Thúc' },
      { header: 'Khách Hàng' },
      { header: 'Công Nghệ' },
      { header: 'Tổng giờ OT' },
      { header: 'Xóa' },
    ];
    this.getListProjects();
  }
  getListProjects() {
    this.searchForm.value.pageSize = this.pageSize;
    this.searchForm.value.pageNo = this.curentPage;
    this.projects = this.searchForm.value;
    this.projectsService.getListProjects(this.projects).subscribe(
      (data :any) => {
        if (data.status === ConstantsCommon.HTTP_STATUS_200) {
          this.listProjects = data.items.items;
          this.listProjects.forEach(item => {
            item.totalOt = Math.round(item.totalOt/3600);
          });
          this.totalRecord = data.items.totalItems;
        }
      },
      (err) => {
        this.listProjects = [];
        this.totalRecord = 0;
      }
    );
  }

  onSearch() {
    this.curentPage = 1;
    this.getListProjects();
  }

  editProjects(id:any) {
    this.router.navigate(['projects-edit/' + id]);
  }

  deleteProjects(id:any) {
    this.projectsService.deleteProjects(id).subscribe(
      data => {
        if(data.status == ConstantsCommon.HTTP_STATUS_200){
          this.showSuccess();
          this.ngOnInit();
        }else{
          this.showError();
        }
      },
      err => {
        this.showError();
      }
    );
  }

  confirm(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: "Xác nhận xóa",
      acceptLabel: "Đồng ý",
      rejectLabel: "Từ chối",
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.deleteProjects(id);
      },
      key: 'positionDialog',
    });
  }

  pageClick(event: any) {
    this.curentPage = event.page + 1;
    this.getListProjects();
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

}
