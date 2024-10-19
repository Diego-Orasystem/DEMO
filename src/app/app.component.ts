import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DEMO-TRASPASOS-1.0';

  ngOnInit() {
    this.storeBodegas();
    this.storeProductos();
    this.storeTipoTransaccion();
    this.storeCentrosCosto();
  }

  storeBodegas() {
    const bodegas = [
      { cod: '01', des: 'CHILOE 1189' },
      { cod: '02', des: 'MATTA' },
      { cod: '08', des: 'CHILOE 1553' },
      { cod: '09', des: 'CONCEPCION' },
      { cod: '10', des: 'CHILOE 1249' },
      { cod: '14', des: 'VITACURA' },
      { cod: '16', des: 'CHILOE 1512' },
      { cod: '20', des: 'CHILOE 1445' },
      { cod: '21', des: 'CHILOE 1230' },
      { cod: '24', des: 'REVI' },
      { cod: '25', des: 'MATTA 1125' },
      { cod: '26', des: 'CD' },
      { cod: '99', des: 'EXTERNA B.L' }
    ];
    localStorage.setItem('bodegas', JSON.stringify(bodegas));
  }
  storeProductos() {
    const productos = [
      { cod: '01', des: 'Escalera' },
      { cod: '02', des: 'Cable' },
      { cod: '03', des: 'Foco' },
      { cod: '04', des: 'Cable Flex' },
      { cod: '05', des: 'Foco 100W' },
    ];
    localStorage.setItem('productos', JSON.stringify(productos));
  }
  storeTipoTransaccion() {
    const tiposTransaccion = [
      { cod: '01', des: 'Ventas del Giro' },
      { cod: '02', des: 'Venta Activo Fijo' },
      { cod: '03', des: 'Venta Bien Raiz' },
    ];
    localStorage.setItem('tiposTransaccion', JSON.stringify(tiposTransaccion));
  }
  storeCentrosCosto() {
    const centrosCosto = [
      { cod: '01-01', des: 'ADMINISTRACION GENERAL' },
      { cod: '01-02', des: 'GERENCIA GENERAL - DIRECTORIO' },
      { cod: '01-03', des: 'GERENCIA ADM Y FINANZAS' },
      { cod: '01-04', des: 'INFORMATICA' },
      { cod: '01-05', des: 'FINANZAS' },
      { cod: '01-06', des: 'CREDITO Y COBRANZAS' },
      { cod: '01-07', des: 'CONTABILIDAD-GESTION' },
      { cod: '01-08', des: 'RRHH' },
      { cod: '02-01', des: 'OPERACIONES - LOGISTICA' },
      { cod: '02-02', des: 'NO USAR - INACTIVO' },
      { cod: '02-03', des: 'ADQUISICIONES-ABASTECIMIENTOS' },
    ];
    localStorage.setItem('centrosCosto', JSON.stringify(centrosCosto));
  }
}
