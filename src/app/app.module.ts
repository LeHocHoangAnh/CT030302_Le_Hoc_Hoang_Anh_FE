import { BrowserModule } from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './shared/layout/home/home.component';
import { HeaderComponent } from './shared/layout/header/app-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgDropDownComponent } from './shared/component/ng-drop-down/ng-drop-down.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { NoRoleComponent } from './modules/no-role/no-role.component';
import { HrmCommonModule } from './shared/hrm-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { HttpErrorInterceptor } from './core/interceptor/http.interceptor';
import { CalendarModule } from 'primeng/calendar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ForgotPasswordComponent } from './modules/auth/login/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './modules/auth/login/create-new-password/create-new-password.component';
import { MMenuContentComponent } from './shared/component/m-menu-content/m-menu-content.component';
import { DialogModule } from 'primeng/dialog';
import { EquipmentManageListComponent } from './modules/system/equipment-manage/equipment-manage-list/equipment-manage-list.component'; 
import { EquipmentManageEditComponent } from './modules/system/equipment-manage/equipment-manage-edit/equipment-manage-edit.component';
import { TitleCommonComponent } from './shared/component/title-common/title-common/title-common.component'; 
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    NgDropDownComponent,
    LoginComponent,
    ContentLayoutComponent,
    FooterComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    NoRoleComponent,
    SpinnerComponent,
    ForgotPasswordComponent,
    CreateNewPasswordComponent,
    MMenuContentComponent,
    EquipmentManageListComponent,
    EquipmentManageEditComponent,
    TitleCommonComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    HrmCommonModule,
    BrowserAnimationsModule,
    CalendarModule,
    MatSlideToggleModule,
    DialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    MessageService,
    ConfirmationService,
    DialogService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
