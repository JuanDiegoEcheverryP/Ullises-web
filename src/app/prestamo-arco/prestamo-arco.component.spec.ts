import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoArcoComponent } from './prestamo-arco.component';

describe('PrestamoArcoComponent', () => {
  let component: PrestamoArcoComponent;
  let fixture: ComponentFixture<PrestamoArcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrestamoArcoComponent]
    });
    fixture = TestBed.createComponent(PrestamoArcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
