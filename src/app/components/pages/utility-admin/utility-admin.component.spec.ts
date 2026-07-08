import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityAdminComponent } from './utility-admin.component';

describe('UtilityAdminComponent', () => {
  let component: UtilityAdminComponent;
  let fixture: ComponentFixture<UtilityAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
