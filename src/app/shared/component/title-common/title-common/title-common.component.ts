import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-common',
  templateUrl: './title-common.component.html',
  styleUrls: ['./title-common.component.scss']
})
export class TitleCommonComponent implements OnInit {
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
