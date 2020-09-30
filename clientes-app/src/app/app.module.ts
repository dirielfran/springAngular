import { BrowserModule } from '@angular/platform-browser';
//Se importa la constante LOCALE_ID
import { NgModule, LOCALE_ID } from '@angular/core';
//se importa el routerModule y routes
import { RouterModule, Routes } from '@angular/router';
/*agrega el modulo HttpClient, que es el mecanismo que tiene
	angular para la comunicacion con el servidor remoto, atraves de peticiones http con dif verbos get, post, put o delete (CRUD)*/
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//DatePicker
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



import { AppComponent } from './app.component';
//Se importa la clase creada
import { HeaderComponent} from './header/header.component';
//Se importa la clase FooterComponent
import { FooterComponent } from './footer/footer.component';
import { DirectivasComponent } from './directivas/directivas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';


//Se importa la clase de servicio
import { ClienteService } from './clientes/cliente.service';


// importa el registerLocalData para localidad config
import { registerLocaleData } from '@angular/common';
//Import locale
import localeES from '@angular/common/locales/es-AR';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';

//Se registra el locale
registerLocaleData(localeES, 'es');

//Se crea constante qu e contiene arreglo con las rutas
//Se definen todas las rutas de la aplicacion
const routes: Routes =[
  //pagina principal
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivasComponent},
  {path: 'clientes', component: ClientesComponent},
  //Ruta con paginacion
  {path: 'clientes/page/:page', component: ClientesComponent},
  //Se mapea la ruta al formulario
  {path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  //Url dond se renderiza metordo que busca cliente por id
  {path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  //ruta para el upload de la imagen
  //{path: 'clientes/ver/:id', component: DetalleComponent}
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    //Se agrega al modulo
    HeaderComponent,
    //Se agrega al modula la clase
    FooterComponent,
    DirectivasComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent
  ],
  imports: [
    BrowserModule,
    //Se registra el HttpClientModule
    HttpClientModule,
    FormsModule,
    //Se registran las rutas creadas
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
   //Se agrega al modulo la clase de servicio
   // Se agrega confg de LOCALE_ID
  providers: [ClienteService,
              {provide: LOCALE_ID, useValue: 'es' },
              MatDatepickerModule,
              MatMomentDateModule,
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
