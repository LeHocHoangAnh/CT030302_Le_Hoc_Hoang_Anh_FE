import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountantComponent } from './approve-general/list-accountant/accountant.component';
import { BookingDayOffComponent } from './booking-day-off/day-off.component';
import { BookingOTComponent } from './booking-ot/booking-ot.component';
import { ConfirmDayOffComponent } from './confirm-day-off/confirm-list/confirm-day-off.component';
import { ConfirmOTComponent } from './confirm-ot/confirm-ot.component';
import { ProfileInformationComponent } from './profile/profile-information/profile-information.component';
import { SalaryComponent } from './salary/salary.component';
import { TimekeepingListComponent } from './timekeeping/timekeeping-list/timekeeping-list.component';
import { EmployeeListComponent } from './employee/employee-list/emloyee-list.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { ProjectsListComponent } from './projects/projects-list/projects-list.component';
import { ProjectsEditComponent } from './projects/projects-edit/projects-edit.component';
import { HistoryEditComponent } from './projects/history-edit/history-edit.component';
import { DepartmentsListComponent } from './departments/departments-list/departments-list.component';
import { eRole } from 'src/app/shared/constants.common';
import { BookingListComponent } from './booking-meeting-room/booking-list/booking-list.component';
import { ConfirmBookingRoomListComponent } from './confirm-booking-meeting/confirm-booking-room-list/confirm-booking-room-list.component';
import { DepartmentEditComponent } from './departments/department-edit/department-edit/department-edit.component';
import { DayOffListComponent } from './day-off/day-off-list/day-off-list.component';
import { InternalDocumentComponent } from './document/internal-document/internal-document.component';
import { InternalDocumentDetailComponent } from './document/internal-document-detail/internal-document-detail.component';
import { EquipmentManageListComponent } from './equipment-manage/equipment-manage-list/equipment-manage-list.component';
import { EquipmentRegisterListComponent } from './equipment-register/equipment-register-list/equipment-register-list.component';

const routes: Routes = [
  {
    path: 'accountant',
    component: AccountantComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'booking-day-off',
    component: BookingDayOffComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'booking-ot',
    component: BookingOTComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'confirm-day-off',
    component: ConfirmDayOffComponent,
    data: {
      expectRole: eRole.LEADER
    }
  },
  {
    path: 'confirm-ot',
    component: ConfirmOTComponent,
    data: {
      expectRole: eRole.LEADER
    }
  },
  {
    path: 'home',
    component: ProfileInformationComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'home/:id',
    component: ProfileInformationComponent,
    data: {
      expectRole: []
    }

  }
  ,
  {
    path: 'salary',
    component: SalaryComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'time-keeping',
    component: TimekeepingListComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'employee/list/:currentpage',
    component: EmployeeListComponent,
    data: {
      expectRole: [eRole.HR, eRole.LEADER]
    }
  },
  {
    path: 'employee/edit/:id/:currentpage',
    component: EmployeeEditComponent,
    data: {
      expectRole: [eRole.HR, eRole.LEADER]
    }
  },
  {
    path: 'employee/edit',
    component: EmployeeEditComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'projects-list',
    component: ProjectsListComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'projects-edit',
    component: ProjectsEditComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'projects-edit/:id',
    component: ProjectsEditComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'history-edit/',
    component: HistoryEditComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'history-edit/:id',
    component: HistoryEditComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  // department screen routing
  {
    path: 'departments-list',
    component: DepartmentsListComponent,
    data: {
      expectRole: eRole.HR,
    },
  },
  {
    path: 'department-edit/',
    component: DepartmentEditComponent,
    data: {
      expectRole: eRole.HR,
    },
  },
  {
    path: 'department-edit/:id',
    component: DepartmentEditComponent,
    data: {
      expectRole: eRole.HR,
    },
  },
  //
  {
    path: 'booking-meeting-room',
    component: BookingListComponent,
    data: {
      expectRole: []
    }
  },
  // {
  //   path: 'confirm-booking-meeting-room',
  //   component: ConfirmBookingRoomListComponent,
  //   data: {
  //     expectRole: eRole.HR
  //   }
  // },
  {
    path: 'day-off-management',
    component: DayOffListComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'equipment-manage',
    component: EquipmentManageListComponent,
    data: {
      expectRole: eRole.HR
    }
  },
  {
    path: 'equipment-register',
    component: EquipmentRegisterListComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'internal-document',
    component: InternalDocumentComponent,
    data: {
      expectRole: []
    }
  },
  {
    path: 'internal-document-detail/:id',
    component: InternalDocumentDetailComponent,
    data: {
      expectRole: [],
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
