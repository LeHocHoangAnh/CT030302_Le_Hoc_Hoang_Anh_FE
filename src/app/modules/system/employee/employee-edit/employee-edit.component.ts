import { LocationStrategy } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownListData } from 'src/app/data/model/DropdownListData';
import { EmployeeService } from 'src/app/data/service/employee/employee.service';
import { RoleService } from 'src/app/data/service/role.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { ImageCropComponent } from '../image-crop/image-crop.component';
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent implements OnInit {
  public submitted = false;

  public formData: FormGroup;

  public mes: MessageValidate = MessageValidate;

  public dropdownDepartment: DropdownListData[] = [];

  public dropdownWork: DropdownListData[] = [];

  public data: any;

  public hide = true;

  public lastEmployee: string;

  public isSubmited: boolean = false;

  public req = new FormData();

  public image: any = null;

  public uploadImg: any = null;

  public id: any;

  public isLeader = false;

  public checkboxRoles: any[];

  public selectedRoles: any[] = [];

  public detailRoleGroup: any;

  public checkedLeader: Boolean = false;

  public checkedSubLeader: Boolean = false;

  public checkedHr: Boolean = false;

  public checkedComtor: Boolean = false;

  public checkedCustomer: Boolean = false;

  date3: Date;

  public addoredit: string;

  public url: string;

  public paramPageRoute: string;

  public flag: boolean = false;

  public otherPosition = ConstantsCommon.OTHER_POSITION;

  public notNull: String = ConstantsCommon.IMPORTANT_VALUE;

  public croppedImageEvent: any;

  public canvasRotation = 0;

  public rotation = 0;

  public scale = 1;

  public showCropper = true;

  public formValue: any;
  public actionBackList: any;
  displayPosition: boolean;
  public cancelDisableFlag: boolean = true;
  position: string;

  public mobileScreen: boolean = false;

  public containWithinAspectRatio = false;
  constructor(
    private employeeService: EmployeeService,
    private router: ActivatedRoute,
    private messageService: MessageService,
    private routers: Router,
    private roleService: RoleService,
    private token: TokenStorageService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private location: LocationStrategy,
    private deviceDetector: DeviceDetectorService
  ) {
    this.mobileScreen = deviceDetector.isMobile();
  }

  // config back button
  @HostListener('window:popstate', ['$event']) onClickBack(
    event: PopStateEvent
  ) {
    event.preventDefault();
    if (JSON.stringify(this.formValue) == JSON.stringify(this.formData.value)) {
      this.cancelFunction();
    }
    else {
      this.showPositionDialog('top');
    }
  }

  ngOnInit(): void {
    history.pushState(null, null, window.location.href);
    this.initForm();
    this.getDropList();
    const paramRoute = this.router.snapshot.paramMap.get('id');
    const paramPageRoute = this.router.snapshot.paramMap.get('currentpage');
    const paramPageSearch = this.router.snapshot.paramMap.get('department');
    this.paramPageRoute = paramPageRoute;
    this.id = paramRoute ? paramRoute : null;
    if (this.id != null) {
      this.getData();
      this.addoredit = 'Chỉnh Sửa Nhân Viên';
    } else {
      this.lastEmp();
      this.addoredit = 'Thêm Mới Nhân Viên';
    }
    this.initCheckRole();
    this.initCheckboxRoles();
  }
  initForm() {
    this.formData = new FormGroup({
      id: new FormControl(),
      email: new FormControl('@its-global.vn'),
      password: new FormControl(),
      employeeCode: new FormControl(),
      typeContract: new FormControl(),
      department: new FormControl(),
      fullName: new FormControl(),
      phoneNumber: new FormControl(),
      dateOfBirth: new FormControl(),
      address: new FormControl(),
      dateEntry: new FormControl(new Date()),
      dateOut: new FormControl(),
      status: new FormControl(),
      taxCode: new FormControl(),
      safeCode: new FormControl(),
      salaryBasic: new FormControl(),
      gender: new FormControl(),
      workName: new FormControl(),
      otherWorkName: new FormControl(),
      selectedRoles: new FormControl(),
      bankName: new FormControl(),
      bankAccount: new FormControl(),
      reviewDate: new FormControl(),
      // discordId: new FormControl(),
      permAddress: new FormControl()
    });
  }

  getDetailRoleGroup() {
    this.roleService
      .getDetailRoleGroup(this.data['roleGroupId'])
      .subscribe((res) => {
        if (res.status == ConstantsCommon.HTTP_STATUS_200) {
          this.detailRoleGroup = res.items;
          this.checkedLeader = this.detailRoleGroup['leaderFlag'];
          this.checkedSubLeader = this.detailRoleGroup['subLeaderFlag'];
          this.checkedHr = this.detailRoleGroup['hrFlag'];
          this.checkedComtor = this.detailRoleGroup['comtorFlag'];
          this.checkedCustomer = this.detailRoleGroup['customerFlag'];
          if (this.checkedLeader) {
            this.selectedRoles.push('leader');
          }
          if (this.checkedSubLeader) {
            this.selectedRoles.push('sub_leader');
          }
          if (this.checkedHr) {
            this.selectedRoles.push('hr');
          }
          if (this.checkedComtor) {
            this.selectedRoles.push('comtor');
          }
          if (this.checkedCustomer) {
            this.selectedRoles.push('customer');
          }
          this.formData.controls['selectedRoles'].setValue(this.selectedRoles);
        } else {
          this.detailRoleGroup = [];
        }
      });
  }
  setObject() {
    this.formData.controls['id'].setValue(this.data['id']);
    this.formData.controls['email'].setValue(this.data['email']);
    this.formData.controls['employeeCode'].setValue(this.data['employeeCode']);
    this.formData.controls['typeContract'].setValue(this.data['typeContract']);
    this.formData.controls['department'].setValue(this.data['departmentId']);
    this.formData.controls['fullName'].setValue(this.data['fullName']);
    this.formData.controls['dateOfBirth'].setValue(this.data['dateOfBirth']);
    this.formData.controls['address'].setValue(this.data['address']);
    this.formData.controls['dateEntry'].setValue(this.data['dateEntry']);
    this.formData.controls['dateOut'].setValue(this.data['dateOut']);
    this.formData.controls['gender'].setValue(this.data['gender']);
    this.formData.controls['status'].setValue(this.data['status']);
    this.formData.controls['bankName'].setValue(this.data['bankName']);
    this.formData.controls['bankAccount'].setValue(this.data['bankAccount']);
    this.formData.controls['reviewDate'].setValue(this.data['reviewDate']);
    // this.formData.controls['discordId'].setValue(this.data['discordId']);
    this.formData.controls['permAddress'].setValue(this.data['permAddress']);


    // check if workName value is from 1-4 or 5
    // if workName value is from 1-4
    if (this.dropdownWork.filter(item => item.name === this.data['workName']).length > 0) {
      // add response workName to workName Controls
      this.formData.controls['workName'].setValue(this.data['workName']);
    }
    // if workName value is 5
    else {
      // workName controls = "Khác"
      this.formData.controls['workName'].setValue(ConstantsCommon.OTHER_POSITION);
      // input field = workName Response
      this.formData.controls['otherWorkName'].setValue(this.data['workName']);
    }

    this.formData.controls['phoneNumber'].setValue(this.data['phoneNumber']);
    this.formData.controls['taxCode'].setValue(this.data['taxCode']);
    this.formData.controls['safeCode'].setValue(this.data['safeCode']);
    this.formData.controls['salaryBasic'].setValue(this.data['salaryBasic']);

    setTimeout(() => {
      this.formValue = this.formData.value;
    }, 200);
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
  submitChange() {
    if (JSON.stringify(this.formData.value) === JSON.stringify(this.formValue))
      this.backToList()
    else
      this.showPositionDialog('top');
  }
  eventOnchange() {
    this.cancelDisableFlag = false;
  }
  initCheckRole() {
    let rules = this.token.getUser()?.roles;
    let isLoggedIn = !!this.token.getToken();
    if (isLoggedIn) {
      // leader - leader comtor
      this.isLeader =
        rules.indexOf(eRole.LEADER) >= 0 && rules.indexOf(eRole.HR) < 0
          ? true
          : false;
    }
  }

  getData() {
    this.employeeService.getEmployeeByid(this.id).subscribe((res) => {
      if (res.status == ConstantsCommon.HTTP_STATUS_200) {
        if (res.items.response) {
          this.data = res.items.response;
          this.formData.controls['password'].setValue(res.items.password);
        }
        else {
          this.data = res.items;
        }
        this.image = this.data.pictureProfile;

        // wait async then set form value
        setTimeout(() => {
          this.setObject();
        }, 300);
        this.getDetailRoleGroup();
      }
    });
  }

  getDropList() {
    this.employeeService.getListDepartment().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.dropdownDepartment = data.items;
      } else {
        this.dropdownDepartment = [];
      }
    });
    this.dropdownWork = [
      { value: 1, name: ConstantsCommon.DEV_POSITION },
      { value: 2, name: ConstantsCommon.COM_POSITION },
      { value: 3, name: ConstantsCommon.TEST_POSITION },
      { value: 4, name: ConstantsCommon.MK_POSITION },
      { value: 5, name: ConstantsCommon.OTHER_POSITION },
    ];
  }

  initCheckboxRoles() {
    this.checkboxRoles = [
      { value: 'leader', name: 'Leader', checked: this.checkedLeader },
      {
        value: 'sub_leader',
        name: 'Sub leader',
        checked: this.checkedSubLeader,
      },
      { value: 'hr', name: 'Hr', checked: this.checkedHr },
      { value: 'comtor', name: 'Comtor', checked: this.checkedComtor },
      { value: 'customer', name: 'customer', checked: this.checkedCustomer },
    ];
  }

  checkedCheckbox(event: any) {
    if (event == 'customer') {
      this.selectedRoles = [];
      this.selectedRoles.push('customer');
      this.formData.controls['selectedRoles'].setValue(this.selectedRoles);
      return;
    }

    if (event == 'leader') {
      this.selectedRoles = this.selectedRoles.filter((e) => e !== 'sub_leader');
    }
    if (event == 'sub_leader') {
      this.selectedRoles = this.selectedRoles.filter((e) => e !== 'leader');
    }
    this.selectedRoles = this.selectedRoles.filter((e) => e !== 'customer');
    this.formData.controls['selectedRoles'].setValue(this.selectedRoles);
  }

  lastEmp() {
    this.employeeService.getLastEmployee().subscribe((data) => {
      this.lastEmployee = data.items;
    });
  }

  get f() {
    return this.formData.controls;
  }

  setRequired() {
    this.formData.controls['email'].setValidators([Validators.required]);
    this.formData.controls['fullName'].setValidators([Validators.required]);
    this.formData.controls['employeeCode'].setValidators([Validators.required]);
    this.formData.controls['phoneNumber'].setValidators([Validators.required]);
    this.formData.controls['password'].setValidators([Validators.required]);
    this.formData.controls['email'].updateValueAndValidity();
    this.formData.controls['employeeCode'].updateValueAndValidity();
    this.formData.controls['fullName'].updateValueAndValidity();
    this.formData.controls['phoneNumber'].updateValueAndValidity();
    this.formData.controls['password'].updateValueAndValidity();
  }
  // transfer value from "otherWorkName" inputfield to request controls "workName"
  patchOtherPosition() {
    this.formData.controls['workName'].patchValue(this.formData.value.otherWorkName);
    this.formData.removeControl('otherWorkName'); // then remove Control of "otherWorkName" from request, avoid request type mismatch in back-end
  }
  saveEmployee(): void {
    this.isSubmited = true;
    this.setRequired();
    if (this.formData.invalid || this.isLeader) {
      return;
    }
    this.employeeService.createOrUpdateEmployee(this.formData.value).subscribe(
      (response) => {
        if (response.status == ConstantsCommon.HTTP_STATUS_200) {
          if (this.uploadImg !== null) {
            this.employeeService
              .uploadImage(this.formData.value['employeeCode'], this.req)
              .subscribe();
          }
          if (this.image == null) {
            this.employeeService
              .deleteImage(this.formData.value['employeeCode'])
              .subscribe();
          }
          this.showSuccess();
          this.backToList();
        } else if (response.status == ConstantsCommon.HTTP_STATUS_405) {
          this.showExits();
        } else {
          this.showError();
        }
      },
      (error) => {
        this.showError();
      }
    );
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

  showExits() {
    this.messageService.add({
      severity: 'error',
      detail: 'Trùng Mã nhân viên hoặc Email',
    });
  }

  onUpload($event) {
    this.imageCropDialog($event);
  }
  // open dialog for create/update image
  imageCropDialog(imageEvent: any) {
    if (this.req.get('file')) {
      this.req.delete('file');
    }
    let header = 'Chỉnh sửa ảnh';
    this.ref = this.dialogService.open(ImageCropComponent, {
      header: header,
      width: this.mobileScreen ? '90%' : '30%',
      baseZIndex: 1000,
      data: { imageEvent: imageEvent },
    });
    this.ref.onClose.subscribe((imageChanged: any) => {
      if (imageChanged !== null && imageChanged !== undefined) {
        this.uploadImg = imageChanged;
        let fileName = imageEvent.target.files[0].name
        let fileChanged = this.dataURLtoFile(imageChanged, fileName);
        this.req.append(
          'file',
          fileChanged,
          fileName
        );
      }
    });
  }
  dataURLtoFile(dataurl: string, filename) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  //cancel Button
  cancelFunction() {
    setTimeout(() => {
      this.backToList();
    }, 300);
  }
  // get local storage of list page and go back
  backToList() {
    this.flag = false;
    localStorage.setItem('flag', JSON.stringify(this.flag));
    let param = this.paramPageRoute ? this.paramPageRoute : 1;
    this.routers.navigate(['employee/list/' + param]);
  }

  removeImg() {
    this.uploadImg = null;
    this.image = null;
  }
}
