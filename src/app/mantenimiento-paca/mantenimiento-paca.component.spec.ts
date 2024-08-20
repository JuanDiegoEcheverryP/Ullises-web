import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPacaComponent } from './mantenimiento-paca.component';

describe('MantenimientoPacaComponent', () => {
  let component: MantenimientoPacaComponent;
  let fixture: ComponentFixture<MantenimientoPacaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoPacaComponent]
    });
    fixture = TestBed.createComponent(MantenimientoPacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
