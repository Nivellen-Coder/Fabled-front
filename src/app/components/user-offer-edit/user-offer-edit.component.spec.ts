import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOfferEditComponent } from './user-offer-edit.component';

describe('UserOfferEditComponent', () => {
  let component: UserOfferEditComponent;
  let fixture: ComponentFixture<UserOfferEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOfferEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
