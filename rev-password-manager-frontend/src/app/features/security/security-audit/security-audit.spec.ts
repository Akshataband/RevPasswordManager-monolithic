import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAudit } from './security-audit';

describe('SecurityAudit', () => {
  let component: SecurityAudit;
  let fixture: ComponentFixture<SecurityAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAudit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAudit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
