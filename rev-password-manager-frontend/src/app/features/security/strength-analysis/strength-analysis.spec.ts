import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrengthAnalysis } from './strength-analysis';

describe('StrengthAnalysis', () => {
  let component: StrengthAnalysis;
  let fixture: ComponentFixture<StrengthAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrengthAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrengthAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
