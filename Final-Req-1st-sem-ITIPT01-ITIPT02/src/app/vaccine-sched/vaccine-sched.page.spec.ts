import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccineSchedPage } from './vaccine-sched.page';

describe('VaccineSchedPage', () => {
  let component: VaccineSchedPage;
  let fixture: ComponentFixture<VaccineSchedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineSchedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
