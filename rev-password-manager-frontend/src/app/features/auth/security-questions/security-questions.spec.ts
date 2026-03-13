import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestions } from './security-questions';

describe('SecurityQuestions', () => {
  let component: SecurityQuestions;
  let fixture: ComponentFixture<SecurityQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityQuestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
