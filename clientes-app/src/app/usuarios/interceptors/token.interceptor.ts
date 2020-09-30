import { Injectable } from '@angular/core';
import{
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

//Se genera un Interceptor a forma de servicio ( @Injectable() )
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  //Se realiza inyeccion de dependencia de la clase de servicio AuthService
  constructor(private authService: AuthService){}
  /* invocamos el método intercept que obtendrá la petición y
  la alterará, retornando un Observable */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    //Obtenemos el token
    let token = this.authService.token;
    //Se valida si existe el token
    if(token != null){
      //Se clona el request
      const authReq = req.clone({
        //Se asigna un header de tipo Authorization con el valor de Bearer + la token
        headers: req.headers.set('Authorization', 'Bearer '+token)
      });
      console.log("token => " + 'Bearer '+token);
      //Se retorna la nueva peticion ya con el header de Authorization
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
