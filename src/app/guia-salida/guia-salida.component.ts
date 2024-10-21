import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-guia-salida',
  templateUrl: './guia-salida.component.html',
  styleUrls: ['./guia-salida.component.css']
})
export class GuiaSalidaComponent implements OnInit {

  guiasSalidas: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, estado: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] }[] = [];
  newEntry = {
    numeroTraspaso: '',
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

  showRadioButtons = false;

  constructor(private toastr: ToastrService) {}  

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion();  
    this.loadCentrosCosto();
    this.loadSolicitudTraspasos(); // Carga las solicitudes de traspaso
  }

  addProduct() {
    if (!this.newProduct.nombre.trim()) {
      this.showToast('El campo "Nombre" es obligatorio.', 'red');
    } else if (this.newProduct.cantidad <= 0) {
      this.showToast('La cantidad debe ser mayor a 0.', 'red');
    } else if (!this.newProduct.precioUnitario.trim() || isNaN(parseFloat(this.newProduct.precioUnitario))) {
      this.showToast('El campo "Precio Unitario" es obligatorio y debe ser un número válido.', 'red');
    } else {
      this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calcular Total
      this.newEntry.productos.push({ ...this.newProduct }); // Usar newProduct para agregar producto
      this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' }; // Reiniciar newProduct después de agregar
      this.showToast('Producto agregado exitosamente!', 'green');
    }
  }

  removeProduct(index: number) {
    this.newEntry.productos.splice(index, 1);
  }

  addEntry() {
    if (!this.newEntry.bodega.trim()) {
      this.showToast('El campo "Bodega" es obligatorio.', 'red');
    } else if (!this.newEntry.numeroGuia.trim()) {
      this.showToast('El campo "Número de Guía" es obligatorio.', 'red');
    } else if (!this.newEntry.concepto.trim()) {
      this.showToast('El campo "Concepto" es obligatorio.', 'red');
    } else if (!this.newEntry.fecha.trim()) {
      this.showToast('El campo "Fecha" es obligatorio.', 'red');
    } else if (!this.newEntry.descripcion.trim()) {
      this.showToast('El campo "Descripción" es obligatorio.', 'red');
    } else if (!this.newEntry.tipoTransaccion.trim()) {
      this.showToast('El campo "Tipo de Transacción" es obligatorio.', 'red');
    } else if (!this.newEntry.bodegaDestino.trim()) {
      this.showToast('El campo "Bodega Destino" es obligatorio.', 'red');
    } else if (!this.newEntry.centroCosto.trim()) {
      this.showToast('El campo "Centro de Costo" es obligatorio.', 'red');
    } else if (this.newEntry.productos.length === 0) {
      this.showToast('Debe agregar al menos un producto.', 'red');
    } else {
      this.guiasSalidas.push({ ...this.newEntry });
      this.newEntry = {
        numeroTraspaso: '',
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
      this.saveEntries();
      this.showToast('Guía de salida agregada exitosamente!', 'green');
    }
  }

  removeEntry(index: number) {
    this.guiasSalidas.splice(index, 1);
    this.saveEntries();
    this.showToast('Guía de salida eliminada exitosamente!', 'green');
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
      this.solicitudTraspasos = JSON.parse(storedSolicitudTraspasos).filter((traspaso: any) => traspaso.estado != 'Rechazada');
    }
  }

  openDetailModal(gSalida: any): void {
    // Implement the logic to open the detail modal
    this.selectedEntry = gSalida;
    // Additional logic to handle modal opening
  }


  calculateTotal(cantidad: number, precioUnitario: number): number {
    return cantidad * precioUnitario;
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

  toggleRadioButtons() {
    this.showRadioButtons = !this.showRadioButtons;
  }
  aprobarSolicitud(numeroGuia: string) {
    const entry = this.guiasSalidas.find(entry => entry.numeroGuia === numeroGuia);
    if (entry) {
      entry.estado = 'Aprobada';
      this.saveEntries();
      this.showToast('Solicitud aprobada exitosamente', 'green'); // Mostrar toast de confirmación
    }
    console.log('Aprobar solicitud', numeroGuia);
  }

  rechazarSolicitud(numeroGuia: string) {
    const entry = this.guiasSalidas.find(entry => entry.numeroGuia === numeroGuia);
    if (entry) {
      entry.estado = 'Rechazada';
      this.saveEntries();
      this.showToast('Solicitud rechazada exitosamente', 'red'); // Mostrar toast de confirmación
    }
  }

  calculateTotalProducto() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calculate Total
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
}
