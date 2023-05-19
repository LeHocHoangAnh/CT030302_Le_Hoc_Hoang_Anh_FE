import { Component, Injectable, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageValidate } from '../message-validation';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-show-message',
  template: ``,
  styles: [],
})
export class ShowMessageComponent implements OnInit {
  constructor(private messageService: MessageService) {}
  ngOnInit() {}

  showErrorMessage() {
    this.messageService.add({
      severity: 'error',
      detail: MessageValidate.MES_ERROR,
    });
  }

  showSuccessMessage() {
    this.messageService.add({
      severity: 'success',
      detail: MessageValidate.MES_SUCCESS,
    });
  }
}
