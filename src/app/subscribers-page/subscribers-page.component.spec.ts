import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersPageComponent } from './subscribers-page.component';

describe('SubscribersPageComponent', () => {
  let component: SubscribersPageComponent;
  let fixture: ComponentFixture<SubscribersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscribersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
