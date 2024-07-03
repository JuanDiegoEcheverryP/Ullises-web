import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerArcosComponent } from './ver-arcos.component';

describe('VerArcosComponent', () => {
  let component: VerArcosComponent;
  let fixture: ComponentFixture<VerArcosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerArcosComponent]
    });
    fixture = TestBed.createComponent(VerArcosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
