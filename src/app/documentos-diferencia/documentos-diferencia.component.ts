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
      if (!this.newProduct.nombre.trim()) {
        //this.showToast('El campo "Nombre" es obligatorio.', 'red');
      } else if (this.newProduct.cantidad <= 0) {
        //this.showToast('La cantidad debe ser mayor a 0.', 'red');
      } else if (!this.newProduct.precioUnitario.trim() || isNaN(parseFloat(this.newProduct.precioUnitario))) {
        //this.showToast('El campo "Precio Unitario" es obligatorio y debe ser un número válido.', 'red');
      } else {
        this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); 
        this.newEntry.productos.push({ ...this.newProduct });  
        this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' };  
      }
    }
  
    removeProduct(index: number) {
      this.newEntry.productos.splice(index, 1);
    }
  
    addEntry() {
      if (!this.newEntry.numeroTraspaso.trim()) {
        //this.showToast('El campo "Número de Traspaso" es obligatorio.', 'red');
      } else if (!this.newEntry.numeroGuiaSalida.trim()) {
        //this.showToast('El campo "Número de Guía de Salida" es obligatorio.', 'red');
      } else if (!this.newEntry.numeroGuiaEntrada.trim()) {
        //this.showToast('El campo "Número de Guía de Entrada" es obligatorio.', 'red');
      } else if (!this.newEntry.motivo.trim()) {
        //this.showToast('El campo "Motivo" es obligatorio.', 'red');
      } else if (!this.newEntry.descripcion.trim()) {
        //this.showToast('El campo "Descripción" es obligatorio.', 'red');
      } else if (this.newEntry.productos.length === 0) {
        //this.showToast('Debe agregar al menos un producto.', 'red');
      } else {
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
        //this.showToast('Documento de diferencia agregado exitosamente!', 'green');
      }
    }
  
    removeEntry(index: number) {
      this.documentoDiferencia.splice(index, 1);
      this.saveEntries();
      //this.showToast('Documento de diferencia eliminado exitosamente!', 'green');
    }
  
    loadEntries() {
      const storedEntries = localStorage.getItem('documentoDiferencia');
      if (storedEntries) {
        console.log('documentoDiferencia', storedEntries);
        this.documentoDiferencia = JSON.parse(storedEntries);
      }
    }
    showToast(message: string, color: string) {
      // Lógica para mostrar un toast de confirmación
      const toast = document.createElement('div');
      toast.className = 'toast show'; // Asegurarse de que la clase 'show' esté presente
      toast.innerText = message;
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.zIndex = '9999'; // Asegurarse de que el toast esté encima de todo
      toast.style.backgroundColor = color; // Usar el color pasado como parámetro
      toast.style.color = '#fff';
      toast.style.padding = '20px'; // Hacer el toast más grande
      toast.style.fontSize = '1.2em'; // Aumentar el tamaño de la fuente
      toast.style.borderRadius = '5px';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
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

    calculateSubTotal(): number {
      return this.newEntry.productos.reduce((acc, product) => acc + (product.cantidad * parseFloat(product.precioUnitario)), 0);
    }
    
    calculateDiscount1(): number {
      // Implementa la lógica para calcular el descuento 1
      return 0;
    }
    
    calculateDiscount2(): number {
      // Implementa la lógica para calcular el descuento 2
      return 0;
    }
    
    calculateDiscount3(): number {
      // Implementa la lógica para calcular el descuento 3
      return 0;
    }
    
    calculateDiscount4(): number {
      // Implementa la lógica para calcular el descuento 4
      return 0;
    }
    
    calculateDiscount5(): number {
      // Implementa la lógica para calcular el descuento 5
      return 0;
    }
    
    calculateTotalFinal(): number {
      const subTotal = this.calculateSubTotal();
      const totalDiscounts = this.calculateDiscount1() + this.calculateDiscount2() + this.calculateDiscount3() + this.calculateDiscount4() + this.calculateDiscount5();
      return subTotal - totalDiscounts;
    }
}
