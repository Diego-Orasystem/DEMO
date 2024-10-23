import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-guia-entrada',
  templateUrl: './guia-entrada.component.html',
  styleUrls: ['./guia-entrada.component.css']
})
export class GuiaEntradaComponent implements OnInit {
  checkboxGuiaEntrada = false;
  guiasEntrada: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  guiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  filteredGuiasSalida: { numeroTraspaso: string, bodega: string, numeroGuia: string, concepto: string, fecha: string, descripcion: string, tipoTransaccion: string, bodegaDestino: string, centroCosto: string, productos: any[] }[] = [];
  guiaSalidaSeleccionada: any = null;
  documentoDiferencia: { numeroDocumento: string; numeroTraspaso: string; numeroGuiaSalida: string; numeroGuiaEntrada: string; fecha: string; motivo: string; descripcion: string; productos: any }[] = [];
  solicitudTraspaso: any[] = [];

  newDocumentoDiferencia = {
    numeroDocumento: '',
    numeroTraspaso: '',
    numeroGuiaSalida: '',
    numeroGuiaEntrada: '',
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    descripcion: '',
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
  };
  newEntry = {
    numeroTraspaso: '',
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
    estado: 'Pendiente',
    tipoTraslado: 'Traslados Internos',
    bodegaDestino: '',
    centroCosto: '',
    productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
  };

  newGuiaSalida = {
    numeroTraspaso: '',
    bodega: '',
    numeroGuia: '',
    concepto: 'Traspasos entre bodegas',
    estado: 'Pendiente',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    tipoTransaccion: '',
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
  newProduct = { 
    nombre: '',
    cantidad: 0,
    precioUnitario: '',
    Total: ''
  };
  productos: string[] = ['Escalera', 'Cable', 'Foco'];  

  constructor() {} // Remove ToastrService injection

  ngOnInit() {
    this.loadEntries();
    this.loadBodegas();
    this.loadTiposTransaccion();
    this.loadGuiasSalida();
    this.loadDocumentoDiferencia();
    this.loadSolicitudTraspaso();

  }

  

  onBodegaChange() {
    this.filteredGuiasSalida = this.guiasSalida.filter(guia => guia.bodega === this.newEntry.bodega);
  }

  addProduct() {
    if (!this.newProduct.nombre.trim()) {
      //this.showToast('El campo "Nombre" es obligatorio.', 'red');
    } else if (this.newProduct.cantidad <= 0) {
      //this.showToast('La cantidad debe ser mayor a 0.', 'red');
    } else if (!this.newProduct.precioUnitario.trim() || isNaN(parseFloat(this.newProduct.precioUnitario))) {
      //this.showToast('El campo "Precio Unitario" es obligatorio y debe ser un número válido.', 'red');
    } else {
      this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calcular Total
      this.newEntry.productos.push({ ...this.newProduct }); // Usar newProduct para agregar producto
      this.newProduct = { nombre: '', cantidad: 0, precioUnitario: '', Total: '' }; // Reiniciar newProduct después de agregar
    }
  }

  removeProduct(index: number) {
    this.newEntry.productos.splice(index, 1);
  }

  addEntry() {
    if (!this.newEntry.bodega.trim()) {
      ////this.showToast('El campo "Bodega" es obligatorio.', 'red');
    } else if (!this.newEntry.numeroGuia.trim()) {
      //this.showToast('El campo "Número de Guía" es obligatorio.', 'red');
    } else if (!this.newEntry.concepto.trim()) {
      //this.showToast('El campo "Concepto" es obligatorio.', 'red');
    } else if (!this.newEntry.fecha.trim()) {
      //this.showToast('El campo "Fecha" es obligatorio.', 'red');
    } else if (!this.newEntry.descripcion.trim()) {
      //this.showToast('El campo "Descripción" es obligatorio.', 'red');
    } else if (!this.newEntry.bodegaDestino.trim()) {
      //this.showToast('El campo "Bodega Destino" es obligatorio.', 'red');
    } else if (!this.newEntry.centroCosto.trim()) {
      //this.showToast('El campo "Centro de Costo" es obligatorio.', 'red');
    } else if (this.newEntry.productos.length === 0) {
      //this.showToast('Debe agregar al menos un producto.', 'red');
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
      this.saveGuiasSalida();
      //this.showToast('Guía de entrada agregada exitosamente!', 'green');
    }
  }
  addDocumentoDiferencia() {
    this.documentoDiferencia.push({ ...this.newDocumentoDiferencia });
    this.newDocumentoDiferencia = {
      numeroDocumento: '',
      numeroTraspaso: '',
      numeroGuiaSalida: '',
      numeroGuiaEntrada: '',
      fecha: '',
      motivo: '',
      descripcion: '',
      productos: [] as { nombre: string; cantidad: number; precioUnitario: string; Total: string }[] // Explicitly define the type
    };
    this.saveDocumentoDiferencia();
  }
  removeEntry(index: number) {
    this.guiasEntrada.splice(index, 1);
    this.saveEntries();
  }
  
  saveGuiasSalida() {
    localStorage.setItem('guiasSalidas', JSON.stringify(this.guiasSalida));
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
  saveDocumentoDiferencia() {
    localStorage.setItem('documentoDiferencia', JSON.stringify(this.documentoDiferencia));
  }

  saveSolicitudTraspaso() {
    localStorage.setItem('solicitudTraspaso', JSON.stringify(this.solicitudTraspaso));
  }

  loadGuiasSalida() {
    const storedGuiasSalida = localStorage.getItem('guiasSalidas');
    if (storedGuiasSalida) {
      this.guiasSalida = JSON.parse(storedGuiasSalida);
      this.filteredGuiasSalida = [...this.guiasSalida];
    }
  }
  loadDocumentoDiferencia() {
    const storedDocumentoDiferencia = localStorage.getItem('documentoDiferencia');
    if (storedDocumentoDiferencia) {
      this.documentoDiferencia = JSON.parse(storedDocumentoDiferencia);
    }
  }
  loadSolicitudTraspaso() {
    const storedSolicitudTraspaso = localStorage.getItem('solicitudTraspaso');
    if (storedSolicitudTraspaso) {
      this.solicitudTraspaso = JSON.parse(storedSolicitudTraspaso);
    }
    this.actualizarEstadosSolicitudTraspasos(this.solicitudTraspaso);
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
      this.newEntry.productos = JSON.parse(JSON.stringify(selectedGuia.productos)); // Deep copy
      this.newEntry.bodega = selectedGuia.bodega;
      this.newEntry.numeroTraspaso = selectedGuia.numeroTraspaso;
      this.guiaSalidaSeleccionada = selectedGuia;
      console.log('new entry', this.newEntry);
    }
  }

  calculateTotal(cantidad: number, precioUnitario: number): number {
    return cantidad * precioUnitario;
  }

  compareProducts(): boolean {
    const salidaProductos = this.guiaSalidaSeleccionada?.productos || [];
    const entradaProductos = this.newEntry.productos || [];

    for (let i = 0; i < entradaProductos.length; i++) {
      const entradaProducto = entradaProductos[i];
      const salidaProducto = salidaProductos.find((p: any) => p.nombre === entradaProducto.nombre);

      if (salidaProducto) {
        if (entradaProducto.cantidad !== salidaProducto.cantidad || 
            parseFloat(entradaProducto.precioUnitario) !== parseFloat(salidaProducto.precioUnitario)) {
          return true; // Hay una diferencia
        }
      } else {
        return true; // Producto no encontrado en la guía de salida
      }
    }
    return false; // No hay diferencias
  }

  crearDocumentoDiferencia() {
    const lastEntry = this.documentoDiferencia[this.documentoDiferencia.length - 1];
    let lastNumeroDocumento = lastEntry && lastEntry.numeroDocumento ? parseInt(lastEntry.numeroDocumento, 10) : 0;
    if (isNaN(lastNumeroDocumento)) {
      lastNumeroDocumento = 0;
    }

    const diferenciaProductos = this.newEntry.productos.map(entradaProducto => {
      const salidaProducto = this.guiaSalidaSeleccionada?.productos.find((p: any) => p.nombre === entradaProducto.nombre);
      if (salidaProducto) {
        return {
          nombre: entradaProducto.nombre,
          cantidad: entradaProducto.cantidad - salidaProducto.cantidad,
          precioUnitario: entradaProducto.precioUnitario,
          Total: (entradaProducto.cantidad - salidaProducto.cantidad) * parseFloat(entradaProducto.precioUnitario)
        };
      } else {
        return {
          nombre: entradaProducto.nombre,
          cantidad: entradaProducto.cantidad,
          precioUnitario: entradaProducto.precioUnitario,
          Total: entradaProducto.cantidad * parseFloat(entradaProducto.precioUnitario)
        };
      }
    });

    this.newDocumentoDiferencia = {
      numeroDocumento: (lastNumeroDocumento + 1).toString(),
      numeroTraspaso: this.newEntry.numeroTraspaso,
      numeroGuiaSalida: this.newEntry.numeroGuia,
      numeroGuiaEntrada: this.newEntry.numeroGuia,
      fecha: new Date().toISOString().split('T')[0],
      motivo: '',
      descripcion: '',
      productos: diferenciaProductos.map(producto => ({
        ...producto,
        Total: producto.Total.toFixed(0) // Convert Total to string
      }))
    };
    
    // Lógica para crear el documento de diferencia
    console.log('Documento de diferencia creado', this.newDocumentoDiferencia);
  }

  calculateTotalProducto() {
    this.newProduct.Total = (this.newProduct.cantidad * parseFloat(this.newProduct.precioUnitario)).toFixed(0); // Calculate Total
  }
  actualizarEstadosSolicitudTraspasos(solicitudTraspaso: any[]) {
    for (const guia of solicitudTraspaso) {
      console.log('Guía de Solicitud de Traspaso:', guia);
      const guiasEntrada = this.guiasEntrada.filter(guiaEntrada => guiaEntrada.numeroTraspaso === guia.numeroGuia);
      console.log('Guias de Entrada encontradas:', guiasEntrada);
      const documentoDiferencia = this.documentoDiferencia.filter(documento => documento.numeroTraspaso === guia.numeroGuia);
      console.log('Documento de Diferencia encontrados:', documentoDiferencia);
     
    let totalProductosSolicitudTraspaso = 0;
    for (const producto of guia.productos) {
      totalProductosSolicitudTraspaso += producto.cantidad;
    }

    let totalProductosGuiasEntrada = 0;
    for (const guiaEntrada of guiasEntrada) {
      for (const producto of guiaEntrada.productos) {
        totalProductosGuiasEntrada += producto.cantidad;
      }
    }

    let totalProductosDocumentosDiferencia = 0;
    for (const documento of documentoDiferencia) {
      for (const producto of documento.productos) {
        totalProductosDocumentosDiferencia += producto.cantidad;
      }
    }

    let TotalProductos = totalProductosSolicitudTraspaso - (totalProductosGuiasEntrada - totalProductosDocumentosDiferencia);


    if (TotalProductos === 0) {
        if (totalProductosGuiasEntrada > 0 && totalProductosDocumentosDiferencia != 0) {
            guia.estado = 'Entrega con Diferencia';
            console.log('Entrega con Diferencia: Cuadrada con Documentos de Diferencia.');
        } else {
            guia.estado = 'Entrega Total';
            console.log('Entrega Total: Cuadrada sin Diferencias.');
        }
    } else {
        if (totalProductosGuiasEntrada > 0) {
            guia.estado = 'Entrega Parcial';
            console.log('Entrega Parcial: Con Diferencias.');
        }
        if (totalProductosGuiasEntrada === 0) {
            guia.estado = 'En Tránsito';
            console.log('En Tránsito: No se han generado guías de entrada para la solicitud.');
        }
    }

    console.log('Total productos en solicitud de traspaso:', totalProductosSolicitudTraspaso);
    console.log('Total productos en guias de entrada:', totalProductosGuiasEntrada);
    console.log('Total productos en documentos de diferencia:', totalProductosDocumentosDiferencia);
    console.log('Total productos:', TotalProductos);
    this.saveSolicitudTraspaso();
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

  radioButtonChange() {
    console.log('radioButtonChange', this.checkboxGuiaEntrada);
    if (this.checkboxGuiaEntrada) {
      this.newGuiaSalida = { ...this.newEntry, fecha: new Date().toISOString().split('T')[0] };
      this.guiasSalida.push(this.newGuiaSalida);
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
