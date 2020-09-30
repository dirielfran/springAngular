import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Se valida si el usuario no esta autenticado
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      //Se obtiene el role de la ruta
      let role = next.data['role'] as string;
      console.log(role);
      //Se valida el role
      if(this.authService.hasRole(role)){
        return true;
      }
      swal.fire('Acceso denegado.',`Usuario ${this.authService.usuario.username} no tiene acceso a este recurso`,'warning');
      this.router.navigate(['/clientes']);
      return false;
  }

}
