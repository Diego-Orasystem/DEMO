import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GuiaEntradaComponent } from './guia-entrada/guia-entrada.component';
import { GuiaSalidaComponent } from './guia-salida/guia-salida.component';
import { HomeComponent } from './home/home.component';
import { DocumentosDiferenciaComponent } from './documentos-diferencia/documentos-diferencia.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GuiaEntradaComponent,
    GuiaSalidaComponent,
    HomeComponent,
    DocumentosDiferenciaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot() // Add ToastrModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
