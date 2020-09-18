//Se importa el decorator
import { Injectable } from '@angular/core';
//Se importa la lista de clientes de un archivo .json
import { CLIENTES } from './clientes.json';
//Se importa la clase cliente
import { Cliente } from './cliente';
//Api Observable y of, soporte para el pase de mensajes entre partes de una aplicacion
//Se importa obj throwError
import { Observable, of, throwError } from 'rxjs';
//Se importa la api que me permite llegar al endpoint
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent  } from '@angular/common/http';
//Se importa de operadorla clase map y catchError, tap
import { map, catchError, tap} from 'rxjs/operators';
//Se importa la libreria de sweetAlert ya instalada
import Swal from 'sweetalert2';
//Se importa objeto Route para redirijir a un enlace
import { Router } from '@angular/router';
//Librerias para el formato de fechas
import { formatDate,DatePipe } from '@angular/common';
import {Region} from './region';
import { AuthService } from '../usuarios/auth.service'


//El decorador indica la funcion de la clase
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //Se alamacena en variable el endPoint
  private urlEndPoint: string ='http://localhost:8080/api/clientes';

  //Se crea headers para el endpoint
  private httpHeaders = new HttpHeaders ({'Content-type':'application/json'});

  //Se instancia en el constructor de la clase el obj HttpClient y el obj Router
  constructor(private http: HttpClient, private router: Router,
              private authService:AuthService) { }

  //metodo que agrega el atributo authorization a la cabecera
  private agregarAuthorizationHeaders(){
    //Se recupera token de la clase de servicio
    let token = this.authService.token;
    //Se valida token
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer '+token);
    }
    return this.httpHeaders;
  }

  //Metodo que valida si hay error 402 o 403 y redirecciona al formulario
  private isNoAutorizado(e){
    if(e.status == 401 || e.status == 403){
      //Se redirecciona
      this.router.navigate(['./login'])
      return false;
    }
    return false;
  }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones', {headers: this.agregarAuthorizationHeaders()}).pipe(
      catchError(e => {
        //validacion de errores de autorizacion
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //Patron de diseño, notifica el cambio de estado de clliente
  //objeto observado
    //Se modifica para que acepte el observable un generico
    //metodo que recupera un objeto pageable del backend
    getClientes(page: number): Observable<any> {
    //pipe permite agregar mas operadores, se toma la respuesta que viene en formato json (any) y se combierte  a un arreglo de clientes
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      //operador tap
      tap(
          //Se indica que la respuesta puede ser un generico
          (response: any) => {
          //Se caste el content de la respuesta a un arrego de clientes
          (response.content as Cliente[]).forEach(
            cliente => {console.log(cliente.nombre)}
          );
        }
      ),
      map(
        //Funcion anonima
        //Se indica que la respuesta puede ser un generico
          (response: any) => {
          //Se caste el content de la respuesta a un arrego de clientes
          (response.content as Cliente[]).map(cliente => {
            //Se agrega formato de mayuscula
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });
          //Se retorna el observable
          return response;
        }
      )
    );
  }

  //Se crea metodo que crea el cliente
  /* createCliente(cliente: Cliente): Observable<Cliente>{ */
    /* Se modifica Observable para que trate un generico */
    createCliente(cliente: Cliente): Observable<any>{
    //Se agrega pipe
    /* return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe( */
      //Se modifica el cast del metodo post
      return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeaders()}).pipe(
      //Se agrega el operador catchError, intercepta en caso de existir error
      catchError(e => {
        //validacion de errores de autorizacion
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        //Manejo de validacion que viene en el response del backend
        if(e.status == 400){
          return throwError(e);
        }

        //Se muestra por consola el error
        console.error(e.error.mensaje);
        //Se muestra mensaje al usuario
        Swal.fire('Error al crear el cliente', e.error.mensaje, 'error');
        //Se retorna obj observable
        return throwError(e);
      })
    );
  }

  //Se crea metodo que recupera un Cliente
  getCliente(id): Observable<Cliente>{
    //Se añade metodo pipe para para transformar la data
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeaders()}).pipe(
      //Se añade obj que me permite detectar si hay errores
      catchError(e => {
        //validacion de errores de autorizacion
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        //Se redirige al capturar el error
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);

        //Se muestra mensaje de error
        Swal.fire('Error al obtener Cliente', e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }
  //Metodo de modificacion del cliente
  update(cliente: Cliente): Observable<Cliente>{
    /* return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe( */
      //Se modifica el cast del metodo put para que no convierta de forma automatica
      return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeaders()}).pipe(
        //Se agrega operador map que combierte a Cliente
        map((response: any) => response.cliente as Cliente),
        catchError( e => {
        //validacion de errores de autorizacion
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        //Manejo de validacion que viene en el response del backend
        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire('Error al modificar cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //Metodo delete de cliente
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeaders()}).pipe(
      catchError( e => {
        //validacion de errores de autorizacion
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar el Ciente.', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //Metodo que llama al endpoint del backend
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    //Se crea objeto tipo FormData, es equivalente al multipart-FormData
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    //Se crea headres
    let httpHeaders = new HttpHeaders();
    //recuepro el token
    let token = this.authService.token;
    //Valido el token
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer '+token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true,
      //Se agrega los headers
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        //validacion de errores de autorizacion
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
