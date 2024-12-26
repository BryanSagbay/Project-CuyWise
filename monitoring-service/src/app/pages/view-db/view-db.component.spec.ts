import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDBComponent } from './view-db.component';

describe('ViewDBComponent', () => {
  let component: ViewDBComponent;
  let fixture: ComponentFixture<ViewDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
