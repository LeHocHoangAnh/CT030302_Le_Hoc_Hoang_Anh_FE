import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquipmentHistoryComponent } from '../../../equipment-manage/equipment-history/equipment-history.component';

@Component({
  selector: 'app-owned-equipment-list',
  templateUrl: './owned-equipment-list.component.html',
  styleUrls: ['./owned-equipment-list.component.scss']
})
export class OwnedEquipmentListComponent implements OnInit {
  @Input() ownedEquipmentCols: any;
  @Input() ownedEquipmentList: any;
  @Input() tableRows: any;
  @Input() mobileScreen: any;

  public equipmentDetail: any;
  public equipmentDetailDialog: boolean = false;
  public ref: DynamicDialogRef;
  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
    console.log(this.ownedEquipmentList);

  }

  openHistoryDialog(id: number) {
    this.ref = this.dialogService.open(EquipmentHistoryComponent, {
      header: 'Lịch Sử Sử Dụng',
      baseZIndex: 1,
      width: this.mobileScreen ? '99%' : '50%',
      data: { id: id }
    })
  }
  openDetailDialog(id: number) {
    this.equipmentDetail = this.ownedEquipmentList.filter((item: any) => item.id === id)[0];
    this.equipmentDetailDialog = true;
  }
}
