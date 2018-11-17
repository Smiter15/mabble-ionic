import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MabbleComponent } from './mabble.component';

describe('MabbleComponent', () => {
  let component: MabbleComponent;
  let fixture: ComponentFixture<MabbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MabbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MabbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
