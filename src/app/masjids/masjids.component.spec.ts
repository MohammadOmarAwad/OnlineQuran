import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasjidsComponent } from './masjids.component';

describe('MasjidsComponent', () => {
  let component: MasjidsComponent;
  let fixture: ComponentFixture<MasjidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasjidsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasjidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
