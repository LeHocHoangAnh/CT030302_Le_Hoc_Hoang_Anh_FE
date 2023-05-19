import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/data/service/employee/employee.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
})
export class ProfileInformationComponent implements OnInit {
  public validate = MessageValidate;

  public formData: FormGroup;

  public mailForm: FormGroup;

  public dataProvider: any = [];

  public checkEditPassword = false;

  public checkShowNewPass = false;

  public checkShowPassCurrent = false;

  public checkShowReNewPass = false;

  public submitted = false;

  public image: any;

  public id: any = null;

  public dataHistory: any[];

  public columns: any[];

  public checked: true;

  public isLeader: boolean = false;

  public orgMailValues: any;

  public mobileScreen: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private showMessage: ShowMessageComponent,
    private router: ActivatedRoute,
    private token: TokenStorageService,
  ) {
    this.mobileScreen = window.outerWidth < 768;
  }

  ngOnInit(): void {
    const paramRoute = this.router.snapshot.paramMap.get('id');
    this.id = paramRoute ? paramRoute : 0;
    console.log(this.id)
    this.header();
    this.getProfileEmployee();
    this.initForm();
    this.initCheckRole();
    this.initMailForm();
  }

  header() {
    this.columns = [
      { header: 'Mã Dự Án' },
      { header: 'Tên Dự Án' },
      { header: 'Ngày Tham Gia' },
      { header: 'Ngày Kết Thúc' },
      { header: 'Vai Trò' },
    ];
    if (this.mobileScreen) {
      this.columns = this.columns.filter(item => item.header !== 'Tên Dự Án');
    }

  }

  initForm() {
    this.formData = new FormGroup({
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[^s]*'),
      ]),
      newPassword: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('[^s]*'),
      ]),
      reNewPassword: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('[^s]*'),
      ]),
    });
  }

  initMailForm() {
    this.mailForm = new FormGroup({
      employeeId: new FormControl(),
      bookingDayOffNotify: new FormControl(),
      confirmDayOffNotify: new FormControl(),
      bookingMeetingNotify: new FormControl(),
      confirmMeetingNotify: new FormControl()
    })
  }

  setMailForm() {
    this.mailForm.controls['employeeId'].setValue(this.dataProvider.id);
    this.mailForm.controls['bookingDayOffNotify'].setValue(this.dataProvider.bookingDayOffNotify);
    this.mailForm.controls['confirmDayOffNotify'].setValue(this.dataProvider.confirmDayOffNotify);
    this.mailForm.controls['bookingMeetingNotify'].setValue(this.dataProvider.bookingMeetingNotify);
    this.mailForm.controls['confirmMeetingNotify'].setValue(this.dataProvider.confirmMeetingNotify);
    this.orgMailValues = this.mailForm.value;
  }

  getProfileEmployee() {
    this.employeeService.getProfileEmployee(this.id).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.dataProvider = res.items.employee;
          console.log(this.id)
          this.image = this.dataProvider.pictureProfile;
          this.dataHistory = res.items.history;
          this.setMailForm();
        } else {
          this.dataProvider = [];
          this.dataHistory = [];
        }
      },
      (err) => {
        this.dataProvider = [];
        this.dataHistory = [];
      }
    );
  }

  get f() {
    return this.formData.controls;
  }
  checkCurrentPassWord = false;
  checkNotSamePassWord = false;
  onSubmit() {
    this.submitted = true;
    this.formData.controls['currentPassword'].setValue(
      this.formData.controls['currentPassword']?.value.trim()
    );
    this.formData.controls['newPassword'].setValue(
      this.formData.controls['newPassword']?.value.trim()
    );
    this.formData.controls['reNewPassword'].setValue(
      this.formData.controls['reNewPassword']?.value.trim()
    );
    if (this.formData.invalid) {
      return;
    }
    if (
      this.formData.controls['reNewPassword']?.value !=
      this.formData.controls['newPassword']?.value
    ) {
      this.checkNotSamePassWord = true;
      return;
    }
    this.employeeService.changePassword(this.formData.value).subscribe(
      (rs) => {
        if (rs.status === ConstantsCommon.HTTP_STATUS_200) {
          this.initForm();
          this.submitted = false;
          this.checkEditPassword = false;
          this.checkCurrentPassWord = false;
          this.showMessage.showSuccessMessage();
        } else {
          this.showMessage.showErrorMessage();
          this.checkCurrentPassWord = true;
        }
      },
      (error) => {
        this.checkCurrentPassWord = true;
        this.showMessage.showErrorMessage();
      }
    );
  }

  editPassword() {
    this.checkEditPassword = !this.checkEditPassword;
  }

  showPassword(event: any) {
    if (event == 1) {
      this.checkShowPassCurrent = !this.checkShowPassCurrent;
    }
    if (event == 2) {
      this.checkShowNewPass = !this.checkShowNewPass;
    }
    if (event == 3) {
      this.checkShowReNewPass = !this.checkShowReNewPass;
    }
  }

  submitChange() {
    if (JSON.stringify(this.mailForm.value) === JSON.stringify(this.orgMailValues)) {
      return null;
    }
    this.employeeService.updateEmailNotifications(this.mailForm.value).subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showMessage.showSuccessMessage();
        this.getProfileEmployee();
      }
      else {
        this.showMessage.showErrorMessage();
      }
    }, (error) => {
      this.showMessage.showErrorMessage();
    });
  }

  initCheckRole() {
    let rules = this.token.getUser()?.roles;
    let isLoggedIn = !!this.token.getToken();
    if (isLoggedIn) {
      // leader - leader comtor
      this.isLeader =
        rules.indexOf(eRole.LEADER) >= 0
          ? true
          : false;
    }
  }
}
