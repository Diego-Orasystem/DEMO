import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-guia-entrada',
  templateUrl: './guia-entrada.component.html',
  styleUrls: ['./guia-entrada.component.css']
})
export class GuiaEntradaComponent implements OnInit {
  guiasEntrada: { bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  guiasSalida: { bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  newEntry = {
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
    estado: 'Vigente',
    tipoTraslado: 'Traslados Internos',
    bodegaDestino: '',
    centroCosto: '',
    productos: [] as { nombre: string; cantidad: number; descripcion: string; precioUnitario: string; Total: string; }[] // Explicitly define the type
  };
  bodegas: string[] = [];
  selectedEntry: {
    bodega: string;
    numeroGuia: string;
    concepto: string;
    fecha: string;
    estado: string;
    descripcion: string;
    tipoTransaccion: string;
    tipoTraslado: string;
    bodegaDestino: string;
    centroCosto: string;
    productos: any[];
  } | null = null;
  productos: string[] = ['Escalera', 'Cable', 'Foco']; // Example product list
  tiposTransaccion: string[] = [];
  constructor(private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion();
    this.loadGuiasSalida();
  }

  addProduct() {
    this.newEntry.productos.push({ nombre: '', cantidad: 0, descripcion: '', precioUnitario: '', Total: '' });
  }

  removeProduct(index: number) {
    this.newEntry.productos.splice(index, 1);
  }

  addEntry() {
    if (this.newEntry.bodega.trim() && this.newEntry.numeroGuia.trim() && this.newEntry.concepto.trim() && this.newEntry.fecha.trim() && this.newEntry.descripcion.trim() && this.newEntry.tipoTransaccion.trim() && this.newEntry.bodegaDestino.trim() && this.newEntry.centroCosto.trim() && this.newEntry.productos.length > 0) {
      this.guiasEntrada.push({ ...this.newEntry });
      this.newEntry = {
        bodega: '',
        numeroGuia: '',
        concepto: 'Traspasos entre bodegas',
        fecha: '',
        estado: 'Vigente',
        descripcion: '',
        tipoTransaccion: '',
        tipoTraslado: 'Traslados Internos',
        bodegaDestino: '',
        centroCosto: '',
        productos: [] as { nombre: string; cantidad: number; descripcion: string; precioUnitario: string; Total: string; }[] // Explicitly define the type
      };
      this.saveEntries();
      this.toastr.success('Guía de entrada agregada exitosamente!');
    } else {
      this.toastr.error('Por favor, complete todos los campos y agregue al menos un producto!');
    }
  }

  removeEntry(index: number) {
    this.guiasEntrada.splice(index, 1);
    this.saveEntries();
    this.toastr.success('Guía de entrada eliminada exitosamente!');
  }

  loadEntries() {
    const storedEntries = localStorage.getItem('guiasEntrada');
    if (storedEntries) {
      this.guiasEntrada = JSON.parse(storedEntries);
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
    localStorage.setItem('guiasEntrada', JSON.stringify(this.guiasEntrada));
  }

  loadGuiasSalida() {
    const storedGuiasSalida = localStorage.getItem('guiasSalida');
    if (storedGuiasSalida) {
      this.guiasSalida = JSON.parse(storedGuiasSalida);
    }
  }

  showAlertToast() {
    this.toastr.show('Este es un mensaje de alerta!', 'Alerta', {
      toastClass: 'toast-alert ngx-toastr',
      positionClass: 'toast-top-right',
      closeButton: true
    });
  }

  openDetailModal(entry: any): void {
    this.selectedEntry = entry;
  }
}
