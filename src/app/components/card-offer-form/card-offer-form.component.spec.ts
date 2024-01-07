import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOfferFormComponent } from './card-offer-form.component';

describe('CardOfferFormComponent', () => {
  let component: CardOfferFormComponent;
  let fixture: ComponentFixture<CardOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardOfferFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
