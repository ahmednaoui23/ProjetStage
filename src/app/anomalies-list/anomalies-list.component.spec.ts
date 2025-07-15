import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomaliesListComponent } from './anomalies-list.component';

describe('AnomaliesListComponent', () => {
  let component: AnomaliesListComponent;
  let fixture: ComponentFixture<AnomaliesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnomaliesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnomaliesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
