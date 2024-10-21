import { Component, AfterViewInit } from '@angular/core';

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
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitamente definir el tipo
  };
  newProduct = { // Añadido objeto newProduct
    nombre: '',
    cantidad: 0,
    precioUnitario: '',
    Total: ''
  };
  bodegas: string[] = [];
  tiposTransaccion: { cod: string, des: string }[] = []; // Añadido array tiposTransaccion
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
  productos: string[] = ['Escalera', 'Cable', 'Foco']; // Lista de productos de ejemplo
  centrosCosto: { cod: string, des: string }[] = [];

  showRadioButtons: boolean = false;


  constructor() {} // Constructor sin ToastrService

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion(); // Cargar tiposTransaccion en la inicialización
    this.loadCentrosCosto();
    this.loadModulos();
    this.setNumeroGuia(); // Establecer numeroGuia en la inicialización
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
    if (!this.newProduct.nombre.trim()) {
      this.showToast('El campo "Nombre" es obligatorio.', 'red');
    } else if (this.newProduct.cantidad <= 0) {
      this.showToast('La cantidad debe ser mayor a 0.', 'red');
    } else if (!this.newProduct.precioUnitario.trim() || isNaN(parseFloat(this.newProduct.precioUnitario))) {
      this.showToast('El campo "Precio Unitario" es obligatorio y debe ser un número válido.', 'red');
    } else {
      this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calcular Total
      this.newEntry.productos.push({ ...this.newProduct }); // Usar newProduct para añadir producto
      this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' }; // Reiniciar newProduct después de añadir
      this.showToast('Producto agregado exitosamente!', 'green'); // Mostrar toast de confirmación
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
        productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitamente definir el tipo
      };
      this.setNumeroGuia(); // Establecer numeroGuia después de añadir entrada
      this.saveEntries();
      this.showToast('Guía de salida agregada exitosamente!', 'green'); // Mostrar toast de confirmación
    }
  }

  removeEntry(index: number) {
    this.solicitudTraspaso.splice(index, 1);
    this.saveEntries();
    this.showToast('Guía de salida eliminada exitosamente!', 'green'); // Mostrar toast de confirmación
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

  loadTiposTransaccion() { // Nuevo método para cargar tiposTransaccion
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
    // Implementar la lógica para abrir el modal de detalles
    this.selectedEntry = gSalida;
    // Lógica adicional para manejar la apertura del modal
  }

  calculateTotal() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calcular Total
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

    // Filtrar guiasSalida, guiasEntrada y documentoDiferencia
    this.relatedGuiasSalida = this.guiasSalida.filter(guia => guia.numeroTraspaso === numeroTraspaso);
    this.relatedGuiasEntrada = this.guiasEntrada.filter(guia => guia.numeroTraspaso === numeroTraspaso);
    this.relatedDocumentosDiferencia = this.documentoDiferencia.filter(doc => doc.numeroTraspaso === numeroTraspaso);

    // Mostrar estas entradas en un modal u otro componente
    console.log('Related Guías de Salida:', this.relatedGuiasSalida);
    console.log('Related Guías de Entrada:', this.relatedGuiasEntrada);
    console.log('Related Documentos de Diferencia:', this.relatedDocumentosDiferencia);

    // Lógica adicional para mostrar estas entradas en un modal
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
        return '#FFD700'; // Amarillo oscuro
      case 'Aprobada':
        return 'green';
      case 'En Tránsito':
        return '#FFD700'; // Amarillo oscuro
      case 'Entrega Total':
        return 'green';
      case 'Rechazada':
        return 'red';
      case 'Entrega con Diferencia':
        return 'green';
      case 'Entrega Parcial':
        return '#FFD700'; // Amarillo oscuro
      default:
        return '';
    }
  }
  

  ngAfterViewInit() {
    this.openTrackingModal = (numeroTraspaso: string) => {
      // Tu lógica existente...
      
      // Añadir la clase de animación
      const truckElement = document.querySelector('.fas.fa-truck');
      if (truckElement) {
        truckElement.classList.add('truck-animation');
      }
    };
  }
}
