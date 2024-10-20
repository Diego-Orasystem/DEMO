import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-guia-salida',
  templateUrl: './guia-salida.component.html',
  styleUrls: ['./guia-salida.component.css']
})
export class GuiaSalidaComponent implements OnInit {

  guiasSalidas: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] }[] = [];
  newEntry = {
    numeroTraspaso: '',
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    tipoTraslado: 'Traslados Internos',
    estado: 'Vigente',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
    bodegaDestino: '',
    centroCosto: '',
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
  };
  newProduct = { 
    nombre: '',
    cantidad: 0,
    precioUnitario: '',
    Total: ''
  };
  bodegas: string[] = [];
  tiposTransaccion: { cod: string, des: string }[] = [];
  selectedEntry: {
    numeroTraspaso: string;
    bodega: string;
    numeroGuia: string;
    concepto: string;
    tipoTraslado: string;
    estado: string;
    fecha: string;
    descripcion: string;
    tipoTransaccion: string;
    bodegaDestino: string;
    centroCosto: string;
    productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[];
  } | null = null;
  productos: string[] = ['Escalera', 'Cable', 'Foco'];  
  centrosCosto: { cod: string, des: string }[] = [];
  solicitudTraspasos: { bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] }[] = [];

  constructor(private toastr: ToastrService) {}  

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion();  
    this.loadCentrosCosto();
    this.loadSolicitudTraspasos(); // Carga las solicitudes de traspaso
  }

  addProduct() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); 
    this.newEntry.productos.push({ ...this.newProduct });  
    this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' };  
  }

  removeProduct(index: number) {
    this.newEntry.productos.splice(index, 1);
  }

  addEntry() {
    if (this.newEntry.bodega.trim() && this.newEntry.numeroGuia.trim() && this.newEntry.concepto.trim() && this.newEntry.fecha.trim() && this.newEntry.descripcion.trim() && this.newEntry.tipoTransaccion.trim() && this.newEntry.bodegaDestino.trim() && this.newEntry.centroCosto.trim() && this.newEntry.productos.length > 0) {
      this.guiasSalidas.push({ ...this.newEntry });
      this.newEntry = {
        numeroTraspaso: '',
        bodega: '',
        numeroGuia: '',
        concepto: 'Traspasos entre bodegas',
        tipoTraslado: 'Traslados Internos',
        estado: 'Vigente',
        fecha: '',
        descripcion: '',
        tipoTransaccion: '',
        bodegaDestino: '',
        centroCosto: '',
        productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
      };
      this.saveEntries();
      this.toastr.success('Guía de salida agregada exitosamente!');
    } else {
      this.toastr.error('Por favor, complete todos los campos y agregue al menos un producto!');
    }
  }

  removeEntry(index: number) {
    this.guiasSalidas.splice(index, 1);
    this.saveEntries();
    this.toastr.success('Guía de salida eliminada exitosamente!');
  }

  loadEntries() {
    const storedEntries = localStorage.getItem('guiasSalidas');
    if (storedEntries) {
      console.log('guias salida', storedEntries);
      this.guiasSalidas = JSON.parse(storedEntries);
    }
  }

  loadBodegas() {
    const storedBodegas = localStorage.getItem('bodegas');
    if (storedBodegas) {
      this.bodegas = JSON.parse(storedBodegas).map((bodega: { cod: string, des: string }) => bodega.cod + ' - ' + bodega.des);
    }
  }

  loadTiposTransaccion() { // New method to load tiposTransaccion
    const storedTiposTransaccion = localStorage.getItem('tiposTransaccion');
    console.log(storedTiposTransaccion);
    if (storedTiposTransaccion) {
      this.tiposTransaccion = JSON.parse(storedTiposTransaccion).map((tipo: { cod: string, des: string }) => tipo.cod + ' - ' + tipo.des);
    }
  }

  saveEntries() {
    localStorage.setItem('guiasSalidas', JSON.stringify(this.guiasSalidas));
  }

  loadCentrosCosto() {
    const storedCentrosCosto = localStorage.getItem('centrosCosto');
    if (storedCentrosCosto) {
      this.centrosCosto = JSON.parse(storedCentrosCosto);
    }
  }

  loadSolicitudTraspasos() {
    const storedSolicitudTraspasos = localStorage.getItem('solicitudTraspaso');
    if (storedSolicitudTraspasos) {
      this.solicitudTraspasos = JSON.parse(storedSolicitudTraspasos);
    }
  }

  openDetailModal(gSalida: any): void {
    // Implement the logic to open the detail modal
    this.selectedEntry = gSalida;
    // Additional logic to handle modal opening
  }

  calculateTotal() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calculate Total
  }

  selectTraspaso(numeroTraspaso: string) {
    const traspaso = this.solicitudTraspasos.find(t => t.numeroGuia === numeroTraspaso);
    if (traspaso) {
      console.log('traspaso', traspaso);
      this.newEntry.bodega = traspaso.bodega || '';
      this.newEntry.bodegaDestino = traspaso.bodegaDestino || '';
      this.newEntry.tipoTransaccion = traspaso.tipoTransaccion || '';
      this.newEntry.descripcion = traspaso.descripcion || '';
      this.newEntry.centroCosto = traspaso.centroCosto || '';
      this.newEntry.productos = traspaso.productos || [];
    } else {
      console.log('Traspaso no encontrado.');
    }
  }
}
