import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerStagedComponent } from './ver-staged.component';

describe('VerStagedComponent', () => {
  let component: VerStagedComponent;
  let fixture: ComponentFixture<VerStagedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerStagedComponent]
    });
    fixture = TestBed.createComponent(VerStagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
