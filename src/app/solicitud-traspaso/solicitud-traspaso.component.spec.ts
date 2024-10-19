import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTraspasoComponent } from './solicitud-traspaso.component';

describe('SolicitudTraspasoComponent', () => {
  let component: SolicitudTraspasoComponent;
  let fixture: ComponentFixture<SolicitudTraspasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudTraspasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudTraspasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
