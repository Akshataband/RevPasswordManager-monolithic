import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassword } from './add-password';

describe('AddPassword', () => {
  let component: AddPassword;
  let fixture: ComponentFixture<AddPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
