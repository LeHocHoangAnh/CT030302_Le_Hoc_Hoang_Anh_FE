import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffEditComponent } from './day-off-edit.component';

describe('DayOffEditComponent', () => {
  let component: DayOffEditComponent;
  let fixture: ComponentFixture<DayOffEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOffEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOffEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
