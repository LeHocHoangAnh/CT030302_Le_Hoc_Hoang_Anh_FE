import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/shared/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InternalDocumentService } from 'src/app/data/service/internal-document.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { EditDocumentRequest } from 'src/app/data/model/request/EditDocumentRequest';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import * as customerEditor from '../internal-document-detail/ckeditor'
@Component({
  selector: 'app-internal-document-detail',
  templateUrl: './internal-document-detail.component.html',
  styleUrls: ['./internal-document-detail.component.scss']
})
export class InternalDocumentDetailComponent implements OnInit {
  public textEncodeBase64: string;
  public textDecodeBase64: string;
  //
  public isHR: boolean = false;
  public isEdit: boolean = false;
  public doCreate: boolean = false;
  //
  public documentId: number;
  public name: string;
  public description: string;
  public textHTML: any;
  public documentDetail: any;
  public editRequest: EditDocumentRequest;
  public isSubmited: boolean = false;
  public notNull = '(*)';
  public editor = customerEditor;
  //
  constructor(
    private commonService: CommonService,
    private ref: DynamicDialogRef,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private internalDocumentService: InternalDocumentService,
    private token: TokenStorageService,
    private dialogConfig: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.fetchDialogData();
    this.isEdit = this.doCreate;
    if (!this.doCreate) {
      this.getDocumentDetail()
    }
  }

  fetchDialogData() {
    const id = this.dialogConfig.data.id;
    if (id === null) {
      this.doCreate = true;
    } else {
      this.documentId = Number(id);
    }
    this.isHR = this.dialogConfig.data.isHr;
  }

  getDocumentDetail() {
    this.internalDocumentService.getDetail(this.documentId).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.documentDetail = response.items;
        this.mappingDataDetail(this.documentDetail);
        this.toHTML();
      }
    })
  }
  mappingDataDetail(documentDetail: any) {
    this.textEncodeBase64 = this.commonService.b64DecodeUnicode(documentDetail.content);
    this.textDecodeBase64 = this.commonService.b64DecodeUnicode(this.textEncodeBase64);
    this.name = documentDetail.name;
    this.description = documentDetail.description;
  }
  // *** edit function ***
  preview() {
    if (this.textDecodeBase64) {
      this.toHTML();
      this.isEdit = !this.isEdit;
    }
  }

  toEdit() {
    this.isEdit = true;
  }
  // *** end ***

  save() {
    // validate null option
    this.isSubmited = true;
    if (!this.nullValidate()) {
      return;
    }
    //
    this.isEdit = false;
    // config html properties
    this.configHTML();
    // encode html
    this.textEncodeBase64 = this.commonService.b64EncodeUnicode(this.textDecodeBase64);
    // create request
    this.editRequest = {
      id: this.documentId ? this.documentId : null,
      name: this.name,
      description: this.description,
      content: this.textEncodeBase64
    };
    //
    this.internalDocumentService.saveEdit(this.editRequest).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.getDocumentDetail();
        this.messageService.add({
          severity: 'info',
          detail: 'Cập nhật thành công'
        })
      }
      this.ref.close(response.status);
    })
  }

  saveConfirmPopUp(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xác nhận lưu bản ghi thông tin?',
      accept: () => {
        this.save();
      },
      reject: () => {

      }
    })
  }
  config = {
    toolbar: {
      items: [
        'heading', '|',
        'fontfamily', 'fontsize',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', '|',
        'link', '|',
        'outdent', 'indent', '|',
        'bulletedList', '-', 'numberedList', '|',
        'insertTable', '|',
        'imageUpload', 'blockQuote', '|',
        'undo', 'redo',
        'specialCharacters'
      ],
      shouldNotGroupWhenFull: true,

    },

    image: {
      styles: [
        'alignLeft', 'alignCenter', 'alignRight'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:50',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        '|',
        'imageTextAlternative'
      ]
    },
    language: 'en'
  };
  toHTML() {
    this.configHTML();
    this.textHTML = this.sanitizer.bypassSecurityTrustHtml(this.textDecodeBase64);
  }

  configHTML() {
    // this.textDecodeBase64 = this.textDecodeBase64.replace(/h2/gi, 'h3');
    // this.textDecodeBase64 = this.textDecodeBase64.replace(/h1/gi, 'h2');
    this.textDecodeBase64 = this.textDecodeBase64.replace(/<li/gi, "<li style='padding: 0.65rem 0 !important;'");
    // this.textDecodeBase64 = this.textDecodeBase64.replace(/href="skype /gi, 'href="skype:');
  }

  nullValidate(): boolean {
    if (this.textDecodeBase64 && this.name) {
      return true;
    }
    else {
      return false;
    }
  }
}
