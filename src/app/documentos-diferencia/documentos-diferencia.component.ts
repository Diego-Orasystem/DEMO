import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documentos-diferencia',
  templateUrl: './documentos-diferencia.component.html',
  styleUrl: './documentos-diferencia.component.css'
})
export class DocumentosDiferenciaComponent implements OnInit {
    documentoDiferencia: { numeroDocumento: string; numeroTraspaso: string; numeroGuiaSalida: string; numeroGuiaEntrada: string; fecha: string; motivo: string; descripcion: string; productos: any }[] = [];
    guiasEntrada: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
    guiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
     newEntry = {
      numeroDocumento: '',
      numeroTraspaso: '',
      numeroGuiaSalida: '',
      numeroGuiaEntrada: '',
      fecha: new Date().toISOString().split('T')[0],
      motivo: '',
      descripcion: '',
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
      numeroDocumento: string;
      numeroTraspaso: string;
      numeroGuiaSalida: string;
      numeroGuiaEntrada: string;
      fecha: string;
      motivo: string;
      descripcion: string;
      productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[];
    } | null = null;
    productos: string[] = ['Escalera', 'Cable', 'Foco'];  
    centrosCosto: { cod: string, des: string }[] = [];
    solicitudTraspasos: { bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] }[] = [];
    filteredGuiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
    filteredGuiasEntrada: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  
    constructor(private toastr: ToastrService) {}  
  
    ngOnInit() {
      this.loadEntries();
      this.loadBodegas();
      this.loadTiposTransaccion();  
      this.loadCentrosCosto();
      this.loadSolicitudTraspasos(); // Carga las solicitudes de traspaso
      this.loadGuiasEntrada();
      this.loadGuiasSalida();
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
      if (this.newEntry.numeroTraspaso.trim() && this.newEntry.numeroGuiaSalida.trim() && this.newEntry.numeroGuiaEntrada.trim() && this.newEntry.motivo.trim() && this.newEntry.descripcion.trim() && this.newEntry.productos.length > 0) {
        const lastEntry = this.documentoDiferencia[this.documentoDiferencia.length - 1];
        let lastNumeroDocumento = lastEntry && lastEntry.numeroDocumento ? parseInt(lastEntry.numeroDocumento, 10) : 0;
        if (isNaN(lastNumeroDocumento)) {
          lastNumeroDocumento = 0;
        }
        this.newEntry.numeroDocumento = (lastNumeroDocumento + 1).toString();
        this.documentoDiferencia.push({ ...this.newEntry });
        this.newEntry = {
          numeroDocumento: '',
          numeroTraspaso: '',
          numeroGuiaSalida: '',
          numeroGuiaEntrada: '',
          fecha: new Date().toISOString().split('T')[0],
          motivo: '',
          descripcion: '',
          productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
        };
        this.saveEntries();
        this.toastr.success('Documento de diferencia agregado exitosamente!');
      } else {
        this.toastr.error('Por favor, complete todos los campos y agregue al menos un producto!');
      }
    }
  
    removeEntry(index: number) {
      this.documentoDiferencia.splice(index, 1);
      this.saveEntries();
      this.toastr.success('Documento de diferencia eliminado exitosamente!');
    }
  
    loadEntries() {
      const storedEntries = localStorage.getItem('documentoDiferencia');
      if (storedEntries) {
        console.log('documentoDiferencia', storedEntries);
        this.documentoDiferencia = JSON.parse(storedEntries);
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
      localStorage.setItem('documentoDiferencia', JSON.stringify(this.documentoDiferencia));
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
  
    loadGuiasEntrada() {
      const storedGuiasEntrada = localStorage.getItem('guiasEntrada');
      if (storedGuiasEntrada) {
        this.guiasEntrada = JSON.parse(storedGuiasEntrada);
        console.log('guiasEntrada', this.guiasEntrada);
      }
    }
  
    loadGuiasSalida() {
      const storedGuiasSalida = localStorage.getItem('guiasSalidas');
      if (storedGuiasSalida) {
        this.guiasSalida = JSON.parse(storedGuiasSalida);
        console.log('guiasSalida', this.guiasSalida);
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
     
        this.newEntry.descripcion = traspaso.descripcion || '';
        this.newEntry.productos = traspaso.productos || [];
        
        // Filter guiasSalida and guiasEntrada
        this.filteredGuiasSalida = this.guiasSalida.filter(guia => guia.numeroTraspaso === numeroTraspaso);
        this.filteredGuiasEntrada = this.guiasEntrada.filter(guia => guia.numeroTraspaso === numeroTraspaso);
      console.log('filteredGuiasSalida', this.filteredGuiasSalida);
      console.log('filteredGuiasEntrada', this.filteredGuiasEntrada);
      } else {
        console.log('Traspaso no encontrado.');
      }
    }
}
