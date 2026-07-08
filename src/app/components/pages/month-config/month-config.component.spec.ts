import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthConfigComponent } from './month-config.component';

describe('MonthConfigComponent', () => {
  let component: MonthConfigComponent;
  let fixture: ComponentFixture<MonthConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
