import { NullTemplateVisitor } from '@angular/compiler';
import {
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountantService } from 'src/app/data/service/accountant-service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import readXlsxFile from 'read-excel-file';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'import-file-exel',
  templateUrl: './import-file-exel.component.html',
  styleUrls: ['./import-file-exel.component.scss'],
})
export class ImportFileExelComponent implements OnInit {
  screenTitle: string = '商品名編集';

  tagName: string;

  submitted: boolean = false;

  public uploadForm: FormGroup;

  public position: string;

  public timeUpdate: any = '';

  public selectedFile: File;

  public dateInExcel: any;

  @ViewChild('exelFile', { read: ElementRef, static: true })
  exelFile: ElementRef;
  constructor(
    private accountantService: AccountantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      csvFiles: new FormControl(),
    });
  }

  onSelectFile($event: any) {
    this.selectedFile = $event.target?.files[0];
    this.getYearMonthInExcel();
  }

  uploadFile(year: any) {
    this.timeUpdate = year;
    if (!this.selectedFile) {
      return;
    }
    if (this.selectedFile.size == 0) {
      this.showError();
      this.clearSelectedFile();
      return;
    }

    const req = new FormData();
    req.append('file', this.selectedFile, this.selectedFile.name);

    this.accountantService.importFileExel(req, this.timeUpdate).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.ref.close(res.status);
          this.clearSelectedFile();
        } else {
          this.showError();
          this.clearSelectedFile();
        }
      },
      (err) => {
        this.showError();
        this.clearSelectedFile();
      }
    );
  }

  confirm(position: string) {
    if (this.config.data !== undefined && this.config.data !== null) {
      // Check if date in filter equals to date in imported file
      if (this.config.data !== this.dateInExcel) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Dữ liệu ngày tháng không khớp',
        });
        this.clearSelectedFile();
      } else {
        this.position = position;
        this.confirmationService.confirm({
          header: 'Xác nhận cập nhật thời gian ' + this.config.data,
          message: 'Nếu đồng ý dữ liệu cũ sẽ bị xóa',
          acceptLabel: 'Đồng ý',
          rejectLabel: 'Từ chối',
          acceptVisible: true,
          rejectVisible: true,
          accept: () => {
            this.uploadFile(this.config.data);
          },
          key: 'positionDialog',
        });
      }
    } else {
      // Fetch database and check if data existed in database or not
      this.accountantService.getListTimeDrop().subscribe((data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          var checkExistedDate = false;
          var listTime = data.items;
          listTime.forEach((item) => {
            if (item.name === this.dateInExcel) {
              checkExistedDate = true;
            }
          });
          // not exist: upload new
          if (!checkExistedDate) {
            this.uploadFile('');
            // exist: require users to choose date filter for overwriting records
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail:
                'Dữ liệu đã tồn tại. Vui lòng chọn ngày tháng nếu muốn cập nhật bản ghi',
            });
            this.clearSelectedFile();
          }
        }
      });
    }
  }
  // Get yyyy-mm format date from imported file
  getYearMonthInExcel() {
    readXlsxFile(this.selectedFile).then((rows) => {
      var value = rows[1][0].toString();
      if (value.includes('Từ ngày')) {
        var dateArray = value.match(/\d{2}([\/.-])\d{2}\1\d{4}/g)[0].split('/');
        this.dateInExcel = dateArray[2] + '-' + dateArray[1];
      }
    });
  }

  clearSelectedFile() {
    this.exelFile.nativeElement.value = null;
    this.selectedFile = null;
  }

  showError() {
    this.messageService.add({
      severity: 'error',
    });
  }
}
