import { Injectable } from '@angular/core';
import{
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
//Se importa la libreria de sweetAlert ya instalada
import Swal from 'sweetalert2';
//Se importa de operadorla clase map y catchError, tap
import { catchError } from 'rxjs/operators';
//Se importa objeto Route para redirijir a un enlace
import { Router } from '@angular/router';

//Se genera un Interceptor a forma de servicio ( @Injectable() )
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //Se realiza inyeccion de dependencia de la clase de servicio AuthService
  constructor(private authService: AuthService,
              private router:Router){}
  /* invocamos el método intercept que obtendrá la petición y
  la alterará, retornando un Observable */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    //Cuendo resivimos validamos los codigos de respuesta
    return next.handle(req).pipe(
      catchError( e => {
        if(e.status == 401){
          //Se valida si el token no ha expirado
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          //Se redirecciona
          this.router.navigate(['./login']);
        }

        if(e.status == 403){
          Swal.fire('Acceso Denegado', `El usuario ${this.authService.usuario.username}`+' no tiene acceso al recurso!', 'warning');
          //Se redirecciona
          this.router.navigate(['./clientes']);
        }
        return throwError(e);
      })
    );
  }
}
