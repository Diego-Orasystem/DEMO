import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosDiferenciaComponent } from './documentos-diferencia.component';

describe('DocumentosDiferenciaComponent', () => {
  let component: DocumentosDiferenciaComponent;
  let fixture: ComponentFixture<DocumentosDiferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosDiferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosDiferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
