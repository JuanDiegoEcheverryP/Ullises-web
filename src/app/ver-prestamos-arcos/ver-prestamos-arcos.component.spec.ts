import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPrestamosArcosComponent } from './ver-prestamos-arcos.component';

describe('VerPrestamosArcosComponent', () => {
  let component: VerPrestamosArcosComponent;
  let fixture: ComponentFixture<VerPrestamosArcosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPrestamosArcosComponent]
    });
    fixture = TestBed.createComponent(VerPrestamosArcosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
