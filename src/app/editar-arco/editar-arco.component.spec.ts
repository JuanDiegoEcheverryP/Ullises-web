import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarArcoComponent } from './editar-arco.component';

describe('EditarArcoComponent', () => {
  let component: EditarArcoComponent;
  let fixture: ComponentFixture<EditarArcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarArcoComponent]
    });
    fixture = TestBed.createComponent(EditarArcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
