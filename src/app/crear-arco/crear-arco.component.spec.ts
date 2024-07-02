import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearArcoComponent } from './crear-arco.component';

describe('CrearArcoComponent', () => {
  let component: CrearArcoComponent;
  let fixture: ComponentFixture<CrearArcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearArcoComponent]
    });
    fixture = TestBed.createComponent(CrearArcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
