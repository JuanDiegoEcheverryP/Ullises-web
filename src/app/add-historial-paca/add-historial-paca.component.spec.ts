import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHistorialPacaComponent } from './add-historial-paca.component';

describe('AddHistorialPacaComponent', () => {
  let component: AddHistorialPacaComponent;
  let fixture: ComponentFixture<AddHistorialPacaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHistorialPacaComponent]
    });
    fixture = TestBed.createComponent(AddHistorialPacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
