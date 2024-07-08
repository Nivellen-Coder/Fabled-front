import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerGuideComponent } from './seller-guide.component';

describe('SellerGuideComponent', () => {
  let component: SellerGuideComponent;
  let fixture: ComponentFixture<SellerGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
