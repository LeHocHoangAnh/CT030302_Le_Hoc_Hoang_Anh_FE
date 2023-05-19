import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { InternalDocumentDetailComponent } from "src/app/modules/system/document/internal-document-detail/internal-document-detail.component";
import { environment } from "src/environments/environment";
import { ConstantsCommon } from "../../constants.common";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class HeaderComponent {
  public documentDetail: any;
  public headerDocument: string = "";
  public ref: DynamicDialogRef;
  constructor(private http: HttpClient, private dialogService: DialogService) {

  }
  ngOnInit() {
    this.http.get(environment.apiUrl + 'api/employee/header-document').subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.documentDetail = response.items;
        this.headerDocument = this.documentDetail.name + (this.documentDetail.description ? (' - ' + this.documentDetail.description) : '');
      }
    })
  }

  openDocumentDetail() {
    this.ref = this.dialogService.open(InternalDocumentDetailComponent, {
      header: 'Chi Tiết',
      width: '60%',
      baseZIndex: 2,
      data: { id: this.documentDetail.id, isHr: false }
    });
  }
}
