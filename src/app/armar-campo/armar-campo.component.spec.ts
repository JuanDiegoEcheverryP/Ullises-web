import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmarCampoComponent } from './armar-campo.component';

describe('ArmarCampoComponent', () => {
  let component: ArmarCampoComponent;
  let fixture: ComponentFixture<ArmarCampoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArmarCampoComponent]
    });
    fixture = TestBed.createComponent(ArmarCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
