import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HrmCommonModule } from 'src/app/shared/hrm-common.module';
import { AccountantComponent } from './approve-general/list-accountant/accountant.component';
import { BookingDayOffComponent } from './booking-day-off/day-off.component';
import { BookingOTComponent } from './booking-ot/booking-ot.component';
import { ConfirmDayOffComponent } from './confirm-day-off/confirm-list/confirm-day-off.component';
import { ConfirmOTComponent } from './confirm-ot/confirm-ot.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';
import { ProfileInformationComponent } from './profile/profile-information/profile-information.component';
import { SalaryComponent } from './salary/salary.component';
import { ImportFileExelComponent } from './approve-general/importFileExel/import-file-exel.component';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { SystemRoutingModule } from './system-routing.module';
import { TimekeepingListComponent } from './timekeeping/timekeeping-list/timekeeping-list.component';
import { BookingComponent } from './timekeeping/booking/booking.component';
import { EmployeeListComponent } from './employee/employee-list/emloyee-list.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { NumberDirective } from 'src/app/shared/numbers-only-directive';
import { ConfirmEditComponent } from './confirm-day-off/confirm-edit/confirm-edit.component';
import { ProjectsListComponent } from './projects/projects-list/projects-list.component';
import { ProjectsEditComponent } from './projects/projects-edit/projects-edit.component';
import { HistoryEditComponent } from './projects/history-edit/history-edit.component';
import { BookingListComponent } from './booking-meeting-room/booking-list/booking-list.component';
import { BookingPopupComponent } from './booking-meeting-room/booking-popup/booking-popup.component';
import { ConfirmBookingRoomListComponent } from './confirm-booking-meeting/confirm-booking-room-list/confirm-booking-room-list.component';
import { ConfirmBookingRoomEditComponent } from './confirm-booking-meeting/confirm-booking-room-edit/confirm-booking-room-edit.component';
import { DepartmentsListComponent } from './departments/departments-list/departments-list.component';
import { DepartmentDialogComponent } from './departments/department-dialog/department-dialog/department-dialog.component';
import { DepartmentEditComponent } from './departments/department-edit/department-edit/department-edit.component';
import { DayOffListComponent } from './day-off/day-off-list/day-off-list.component';
import { DayOffEditComponent } from './day-off/day-off-list/day-off-edit/day-off-edit.component';
import { EditAccountantComponent } from './approve-general/edit-accountant/edit-accountant.component';
import { ImageCropComponent } from './employee/image-crop/image-crop.component';
import { InternalDocumentComponent } from './document/internal-document/internal-document.component';
import { InternalDocumentDetailComponent } from './document/internal-document-detail/internal-document-detail.component';
import { EquipmentHistoryComponent } from './equipment-manage/equipment-history/equipment-history.component';
import { EquipmentRegisterListComponent } from './equipment-register/equipment-register-list/equipment-register-list.component';
import { EquipmentRegisterEditComponent } from './equipment-register/equipment-register-edit/equipment-register-edit.component';
import { EmployeeRegisterListComponent } from './equipment-register/equipment-register-list/employee-register-list/employee-register-list.component';
import { OwnedEquipmentListComponent } from './equipment-register/equipment-register-list/owned-equipment-list/owned-equipment-list.component';
import { EquipmentRegisterComponent } from './equipment-register/equipment-register-list/equipment-register/equipment-register.component';

@NgModule({
  declarations: [
    AccountantComponent,
    BookingDayOffComponent,
    BookingOTComponent,
    ConfirmDayOffComponent,
    ConfirmOTComponent,
    ImportFileExelComponent,
    ProfileInformationComponent,
    SalaryComponent,
    RoleListComponent,
    RoleEditComponent,
    TimekeepingListComponent,
    BookingComponent,
    EmployeeEditComponent,
    EmployeeListComponent,
    ConfirmEditComponent,
    ProjectsListComponent,
    ProjectsEditComponent,
    HistoryEditComponent,
    NumberDirective,
    BookingListComponent,
    BookingPopupComponent,
    ConfirmBookingRoomListComponent,
    ConfirmBookingRoomEditComponent,
    DepartmentsListComponent,
    DepartmentDialogComponent,
    DepartmentEditComponent,
    DayOffListComponent,
    DayOffEditComponent,
    EditAccountantComponent,
    ImageCropComponent,
    InternalDocumentComponent,
    InternalDocumentDetailComponent,
    EquipmentHistoryComponent,
    EquipmentRegisterListComponent,
    EquipmentRegisterEditComponent,
    EmployeeRegisterListComponent,
    OwnedEquipmentListComponent,
    EquipmentRegisterComponent,
  ],
  imports: [SystemRoutingModule, HrmCommonModule],
  providers: [DynamicDialogConfig, DynamicDialogRef, DialogService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SystemModule { }
