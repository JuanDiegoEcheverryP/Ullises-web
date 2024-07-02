import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPacaComponent } from './crear-paca.component';

describe('CrearPacaComponent', () => {
  let component: CrearPacaComponent;
  let fixture: ComponentFixture<CrearPacaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearPacaComponent]
    });
    fixture = TestBed.createComponent(CrearPacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
