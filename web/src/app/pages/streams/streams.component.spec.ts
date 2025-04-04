import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsComponent } from './streams.component';

describe('StreamsComponent', () => {
  let component: StreamsComponent;
  let fixture: ComponentFixture<StreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
