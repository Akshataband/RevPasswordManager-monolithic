import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPasswordModal } from './view-password-modal';

describe('ViewPasswordModal', () => {
  let component: ViewPasswordModal;
  let fixture: ComponentFixture<ViewPasswordModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPasswordModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPasswordModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
