import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPacasComponent } from './ver-pacas.component';

describe('VerPacasComponent', () => {
  let component: VerPacasComponent;
  let fixture: ComponentFixture<VerPacasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPacasComponent]
    });
    fixture = TestBed.createComponent(VerPacasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
