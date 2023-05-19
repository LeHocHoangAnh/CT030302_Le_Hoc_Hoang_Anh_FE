import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentListResponse } from 'src/app/data/model/response/DocumentListResponse';
import { InternalDocumentService } from 'src/app/data/service/internal-document.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { InternalDocumentDetailComponent } from '../internal-document-detail/internal-document-detail.component';
@Component({
  selector: 'app-internal-document',
  templateUrl: './internal-document.component.html',
  styleUrls: ['./internal-document.component.scss']
})
export class InternalDocumentComponent implements OnInit {
  public testList: { name: string }[] = [
    { name: 'Hướng Dẫn Cập Nhật Trạng Thái BackLog' },
    { name: 'How To Master Git' },
    { name: 'Quy Định Về Hợp Đồng Lao Động' },
    { name: 'Nội Quy Nội Bộ Công Ty' },
    { name: 'Quy Định Tòa Nhà IDMC 2' },
    { name: 'Quy Định Chấm Công' },
    { name: 'Cơ Cấu Tổ Chức' },
    { name: 'Test 8' },
    { name: 'Test 9' },
    { name: 'Test 10' },
    { name: 'Test 11' },
    { name: 'Test 12' },
    { name: 'Test 13' },
    { name: 'Test 14' },
    { name: 'Test 15' }
  ];
  public searchToggle = false;
  public ref: DynamicDialogRef;
  public mobileScreen: boolean = false;
  public screenWidth: number;
  public documentList: DocumentListResponse[] = [];
  public isHr: boolean = false;
  constructor(
    private token: TokenStorageService,
    private router: Router,
    private dialogService: DialogService,
    private internalDocumentService: InternalDocumentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    this.screenWidth = window.outerWidth;
    this.mobileScreen = this.screenWidth < 768;
  }

  ngOnInit(): void {
    let rules = this.token.getUser()?.roles;
    this.isHr = rules.indexOf(eRole.HR) >= 0 ? true : false;
    this.getDocumentList();
  }

  getDocumentList() {
    this.internalDocumentService.getList().subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.documentList = response.items;
      }
    })
  }

  toDetail(id: any) {
    this.router.navigate(['internal-document-detail/' + id]);
  }

  openDetailDialog(id: number) {
    this.ref = this.dialogService.open(InternalDocumentDetailComponent, {
      header: id ? 'Chi Tiết' : 'Tạo Mới',
      width: this.mobileScreen ? '100%' : '60%',
      baseZIndex: 2,
      data: { id: id, isHr: this.isHr }
    });
    this.ref.onClose.subscribe((status: any) => {
      this.getDocumentList();
    });
  }

  deleteConfirmPopup(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xác nhận thao tác xóa bản ghi thông tin?',
      accept: () => {
        this.deleteDocument(id);
      },
      reject: () => {

      }
    })
  }
  deleteDocument(id: number) {
    this.internalDocumentService.delete(id).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.getDocumentList();
      }
      else {
        this.showError();
      }
    }, (error) => {
      this.showError();
    });
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
