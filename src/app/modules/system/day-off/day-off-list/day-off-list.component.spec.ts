import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffListComponent } from './day-off-list.component';

describe('DayOffListComponent', () => {
  let component: DayOffListComponent;
  let fixture: ComponentFixture<DayOffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
