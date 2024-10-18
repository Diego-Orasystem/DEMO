import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuiaEntradaComponent } from './guia-entrada/guia-entrada.component';
import { GuiaSalidaComponent } from './guia-salida/guia-salida.component';
import { HomeComponent } from './home/home.component';
import { DocumentosDiferenciaComponent } from './documentos-diferencia/documentos-diferencia.component';

const routes: Routes = [
  { path: 'guia-entrada', component: GuiaEntradaComponent },
  { path: 'guia-salida', component: GuiaSalidaComponent },
  { path: 'documentos-diferencia', component: DocumentosDiferenciaComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
