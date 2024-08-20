import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoArcoComponent } from './mantenimiento-arco.component';

describe('MantenimientoArcoComponent', () => {
  let component: MantenimientoArcoComponent;
  let fixture: ComponentFixture<MantenimientoArcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoArcoComponent]
    });
    fixture = TestBed.createComponent(MantenimientoArcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
