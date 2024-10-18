import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-guia-entrada',
  templateUrl: './guia-entrada.component.html',
  styleUrls: ['./guia-entrada.component.css']
})
export class GuiaEntradaComponent implements OnInit {
  guiasEntrada: { bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  newEntry = {
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
    bodegaDestino: '',
    centroCosto: '',
    productos: [] as { nombre: string; cantidad: number; descripcion: string; }[] // Explicitly define the type
  };
  bodegas: string[] = [];
  selectedEntry: {
    bodega: string;
    numeroGuia: string;
    concepto: string;
    fecha: string;
    descripcion: string;
    tipoTransaccion: string;
    bodegaDestino: string;
    centroCosto: string;
    productos: any[];
  } | null = null;
  productos: string[] = ['Escalera', 'Cable', 'Foco']; // Example product list

  constructor(private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
  }

  addProduct() {
    this.newEntry.productos.push({ nombre: '', cantidad: 0, descripcion: '' });
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
        descripcion: '',
        tipoTransaccion: '',
        bodegaDestino: '',
        centroCosto: '',
        productos: [] as { nombre: string; cantidad: number; descripcion: string; }[] // Explicitly define the type
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

  saveEntries() {
    localStorage.setItem('guiasEntrada', JSON.stringify(this.guiasEntrada));
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
