import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guia-entrada',
  templateUrl: './guia-entrada.component.html',
  styleUrls: ['./guia-entrada.component.css']
})
export class GuiaEntradaComponent implements OnInit {
  guiasEntrada: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  guiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  filteredGuiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  
  newEntry = {
    numeroTraspaso: '',
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
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
  };
  bodegas: string[] = [];
  selectedEntry: {
    numeroTraspaso: string;
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
    productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[];
  } | null = null;
  tiposTransaccion: string[] = [];
  newProduct = { // Added newProduct object
    nombre: '',
    cantidad: 0,
    precioUnitario: '',
    Total: ''
  };
  constructor() {} // Remove ToastrService injection

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion();
    this.loadGuiasSalida();
  }

  onBodegaChange() {
    this.filteredGuiasSalida = this.guiasSalida.filter(guia => guia.bodega === this.newEntry.bodega);
  }

  addProduct() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calculate Total
    this.newEntry.productos.push({ ...this.newProduct }); // Use newProduct to add product
    this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' }; // Reset newProduct after adding
  }

  removeProduct(index: number) {
    this.newEntry.productos.splice(index, 1);
  }

  addEntry() {
    if (!this.newEntry.bodega.trim()) {
      console.log('El campo "Bodega" es obligatorio.');
    } else if (!this.newEntry.numeroGuia.trim()) {
      console.log('El campo "Número de Guía" es obligatorio.');
    } else if (!this.newEntry.concepto.trim()) {
      console.log('El campo "Concepto" es obligatorio.');
    } else if (!this.newEntry.fecha.trim()) {
      console.log('El campo "Fecha" es obligatorio.');
    } else if (!this.newEntry.descripcion.trim()) {
      console.log('El campo "Descripción" es obligatorio.');
    } else if (!this.newEntry.bodegaDestino.trim()) {
      console.log('El campo "Bodega Destino" es obligatorio.');
    } else if (!this.newEntry.centroCosto.trim()) {
      console.log('El campo "Centro de Costo" es obligatorio.');
    } else if (this.newEntry.productos.length === 0) {
      console.log('Debe agregar al menos un producto.');
    } else {
      this.guiasEntrada.push({ ...this.newEntry });
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
    }
  }
  removeEntry(index: number) {
    this.guiasEntrada.splice(index, 1);
    this.saveEntries();
  }

  loadEntries() {
    const storedEntries = localStorage.getItem('guiasEntrada');
    if (storedEntries) {
      console.log('guias entrada', storedEntries);
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
    const storedGuiasSalida = localStorage.getItem('guiasSalidas');
    if (storedGuiasSalida) {
      this.guiasSalida = JSON.parse(storedGuiasSalida);
      this.filteredGuiasSalida = [...this.guiasSalida];
    }
  }

  openDetailModal(entry: any): void {
    this.selectedEntry = entry;
  }

  onNumeroGuiaChange() {
    const selectedGuia = this.filteredGuiasSalida.find(guia => guia.numeroGuia === this.newEntry.numeroGuia);
    if (selectedGuia) {
      this.newEntry.descripcion = selectedGuia.descripcion;
      this.newEntry.centroCosto = selectedGuia.centroCosto;
      this.newEntry.bodegaDestino = selectedGuia.bodegaDestino;
      this.newEntry.productos = selectedGuia.productos;
      this.newEntry.bodega = selectedGuia.bodega;
      this.newEntry.numeroTraspaso = selectedGuia.numeroTraspaso;
      console.log('new entry', this.newEntry);
    }
  }
}
