import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated()){
        //Se valida expiracion del token
        if(this.isTokenExpirado()){
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/login']);
      return false;
  }

  isTokenExpirado():boolean{
    //Se obtiene el token
    let token = this.authService.token;
    //Se obtiene el payload
    let payload = this.authService.obtenerDatosToken(token);
    //Se obtiene el tiempo actual
    let tiempoActual = new Date().getTime() / 1000;
    //Se valida que el tiempo de expiracion del token no sea menos al actual
    if(payload.exp < tiempoActual){
      return true;
    }
    return false;
  }

}
