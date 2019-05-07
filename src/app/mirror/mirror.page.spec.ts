import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorPage } from './mirror.page';

describe('MirrorPage', () => {
  let component: MirrorPage;
  let fixture: ComponentFixture<MirrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MirrorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
