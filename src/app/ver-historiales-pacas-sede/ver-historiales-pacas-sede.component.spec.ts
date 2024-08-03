import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistorialesPacasSedeComponent } from './ver-historiales-pacas-sede.component';

describe('VerHistorialesPacasSedeComponent', () => {
  let component: VerHistorialesPacasSedeComponent;
  let fixture: ComponentFixture<VerHistorialesPacasSedeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerHistorialesPacasSedeComponent]
    });
    fixture = TestBed.createComponent(VerHistorialesPacasSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
