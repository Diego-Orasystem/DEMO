import { Component, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitud-traspaso',
  templateUrl: './solicitud-traspaso.component.html',
  styleUrl: './solicitud-traspaso.component.css'
})
export class SolicitudTraspasoComponent implements AfterViewInit {
  documentoDiferencia: { numeroDocumento: string; numeroTraspaso: string; numeroGuiaSalida: string; numeroGuiaEntrada: string; fecha: string; motivo: string; descripcion: string; productos: any }[] = [];
  guiasEntrada: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  guiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
 
  relatedGuiasEntrada: any[] = [];
  relatedGuiasSalida: any[] = [];
  relatedDocumentosDiferencia: any[] = [];

  solicitudTraspaso: { bodega: string, numeroGuia: string, estado: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] }[] = [];
  newEntry = {
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    tipoTraslado: 'Traslados Internos',
    estado: 'Pendiente',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
    bodegaDestino: '',
    centroCosto: '',
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
  };
  newProduct = { // Added newProduct object
    nombre: '',
    cantidad: 0,
    precioUnitario: '',
    Total: ''
  };
  bodegas: string[] = [];
  tiposTransaccion: { cod: string, des: string }[] = []; // Added tiposTransaccion array
  selectedEntry: {
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
  productos: string[] = ['Escalera', 'Cable', 'Foco']; // Example product list
  centrosCosto: { cod: string, des: string }[] = [];

  showRadioButtons: boolean = false;


  constructor(private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion(); // Load tiposTransaccion on initialization
    this.loadCentrosCosto();
    this.loadModulos();
    this.setNumeroGuia(); // Set numeroGuia on initialization
  }

  setNumeroGuia() {
    const lastEntry = this.solicitudTraspaso.reduce((prev, current) => {
      const prevNumero = parseInt(prev.numeroGuia, 10);
      const currentNumero = parseInt(current.numeroGuia, 10);
      return (isNaN(currentNumero) ? 0 : currentNumero) > (isNaN(prevNumero) ? 0 : prevNumero) ? current : prev;
    }, { numeroGuia: '0' });

    const lastNumeroGuia = parseInt(lastEntry.numeroGuia, 10);
    this.newEntry.numeroGuia = isNaN(lastNumeroGuia) ? '0' : (lastNumeroGuia + 1).toString();
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
    if (this.newEntry.bodega.trim() && this.newEntry.numeroGuia.trim() && this.newEntry.concepto.trim() && this.newEntry.fecha.trim() && this.newEntry.descripcion.trim() && this.newEntry.tipoTransaccion.trim() && this.newEntry.bodegaDestino.trim() && this.newEntry.centroCosto.trim() && this.newEntry.productos.length > 0) {
      this.solicitudTraspaso.push({ ...this.newEntry });
      this.newEntry = {
        bodega: '',
        numeroGuia: '',
        concepto: 'Traspasos entre bodegas',
        tipoTraslado: 'Traslados Internos',
        estado: 'Pendiente',
        fecha: '',
        descripcion: '',
        tipoTransaccion: '',
        bodegaDestino: '',
        centroCosto: '',
        productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
      };
      this.setNumeroGuia(); // Set numeroGuia after adding entry
      this.saveEntries();
      this.toastr.success('Guía de salida agregada exitosamente!');
    } else {
      this.toastr.error('Por favor, complete todos los campos y agregue al menos un producto!');
    }
  }

  removeEntry(index: number) {
    this.solicitudTraspaso.splice(index, 1);
    this.saveEntries();
    this.toastr.success('Guía de salida eliminada exitosamente!');
  }

  loadEntries() {
    const storedEntries = localStorage.getItem('solicitudTraspaso');
    if (storedEntries) {
      console.log('guias salida', storedEntries);
      this.solicitudTraspaso = JSON.parse(storedEntries);
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
    localStorage.setItem('solicitudTraspaso', JSON.stringify(this.solicitudTraspaso));
  }

  loadCentrosCosto() {
    const storedCentrosCosto = localStorage.getItem('centrosCosto');
    if (storedCentrosCosto) {
      this.centrosCosto = JSON.parse(storedCentrosCosto);
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
  loadModulos() {
    const storedGuiaSalida = localStorage.getItem('guiasSalidas');
    const storedGuiaEntrada = localStorage.getItem('guiasEntrada');
    const storedDocumentosDiferencia = localStorage.getItem('documentoDiferencia');
    if (storedGuiaSalida) {
      this.guiasSalida = JSON.parse(storedGuiaSalida);
    }

    if (storedGuiaEntrada) {
      this.guiasEntrada = JSON.parse(storedGuiaEntrada);
    }

    if (storedDocumentosDiferencia) {
      this.documentoDiferencia = JSON.parse(storedDocumentosDiferencia);
    }
  }

  openTrackingModal(numeroTraspaso: string): void {

    // Filter guiasSalida, guiasEntrada, and documentoDiferencia
    this.relatedGuiasSalida = this.guiasSalida.filter(guia => guia.numeroTraspaso === numeroTraspaso);
    this.relatedGuiasEntrada = this.guiasEntrada.filter(guia => guia.numeroTraspaso === numeroTraspaso);
    this.relatedDocumentosDiferencia = this.documentoDiferencia.filter(doc => doc.numeroTraspaso === numeroTraspaso);

    // Display these entries in a modal or another component
    console.log('Related Guías de Salida:', this.relatedGuiasSalida);
    console.log('Related Guías de Entrada:', this.relatedGuiasEntrada);
    console.log('Related Documentos de Diferencia:', this.relatedDocumentosDiferencia);

    // Additional logic to display these entries in a modal
  }
  toggleRadioButtons() {
    this.showRadioButtons = !this.showRadioButtons;
  }
  aprobarSolicitud(numeroGuia: string) {
    const entry = this.solicitudTraspaso.find(entry => entry.numeroGuia === numeroGuia);
    if (entry) {
      entry.estado = 'Aprobada';
      this.saveEntries();
      // this.showRadioButtons = false; // Dejar de mostrar los botones
      this.showToast('Solicitud aprobada exitosamente', 'green'); // Mostrar toast de confirmación
    }
    console.log('Aprobar solicitud', numeroGuia);
  }

  rechazarSolicitud(numeroGuia: string) {
    const entry = this.solicitudTraspaso.find(entry => entry.numeroGuia === numeroGuia);
    if (entry) {
      entry.estado = 'Rechazada';
      this.saveEntries();
      this.showToast('Solicitud rechazada exitosamente', 'red'); // Mostrar toast de confirmación
    }
  }

  showToast(message: string, color: string) {
    // Lógica para mostrar un toast de confirmación
    const toast = document.createElement('div');
    toast.className = 'toast show'; // Asegurarse de que la clase 'show' esté presente
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = color; // Usar el color pasado como parámetro
    toast.style.color = '#fff';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  } 
  getTruckPosition(): string {
    switch (this.selectedEntry?.estado) {
      case 'Pendiente':
        return '0%';
      case 'Aprobada':
        return '0%';
      case 'Rechazada':
        return '0%';
      case 'En Tránsito':
        return '32%';
      case 'Entrega Parcial':
        return '57%';
      case 'Entrega con Diferencia':
        return '83%';
      case 'Entrega Total':
        return '83%';
      default:
        return '0%';
    }
  }


  getLastPointColor(estado: string): string {
    console.log('estado', estado);
    switch (estado) {
      case 'Pendiente':
        return '#FFD700'; // Darker yellow
      case 'Aprobada':
        return 'green';
      case 'En Tránsito':
        return '#FFD700'; // Darker yellow
      case 'Entrega Total':
        return 'green';
      case 'Rechazada':
        return 'red';
      case 'Entrega con Diferencia':
        return 'green';
      case 'Entrega Parcial':
        return '#FFD700'; // Darker yellow
      default:
        return '';
    }
  }

  ngAfterViewInit() {
    this.openTrackingModal = (numeroTraspaso: string) => {
      // Your existing logic...
      
      // Add the animation class
      const truckElement = document.querySelector('.fas.fa-truck');
      if (truckElement) {
        truckElement.classList.add('truck-animation');
      }
    };
  }
}
