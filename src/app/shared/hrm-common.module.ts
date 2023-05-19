import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import {CheckboxModule} from 'primeng/checkbox';
import { ImageCropperModule } from 'ngx-image-cropper';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ScrollPanelModule} from 'primeng/scrollpanel'
import {OrderListModule} from 'primeng/orderlist';
import {FieldsetModule} from 'primeng/fieldset';
import {EditorModule} from 'primeng/editor';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
// Angular material
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CKEditorModule } from 'ckeditor4-angular';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
]);
@NgModule({
  imports: [MatSlideToggleModule, CKEditorModule],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    TableModule,
    DynamicDialogModule,
    FullCalendarModule,
    CalendarModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    RadioButtonModule,
    InputNumberModule,
    PaginatorModule,
    AutoCompleteModule,
    SidebarModule,
    DialogModule,
    ToolbarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    ProgressBarModule,
    FileUploadModule,
    CheckboxModule,
    ImageCropperModule,
    OverlayPanelModule,
    ToggleButtonModule,
    TabViewModule,
    PanelModule,
    ColorPickerModule,
    ScrollPanelModule,
    OrderListModule,
    FieldsetModule,
    EditorModule,
    ConfirmPopupModule,
    // Angular material
    MatListModule,
    MatSlideToggleModule,
    CKEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HrmCommonModule {}
