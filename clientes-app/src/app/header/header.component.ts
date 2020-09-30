//Se importa el Component para poderlo utilizar como decorador
import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
//Se crea decorator
@Component({
    //Se agrega el selector
    selector: 'app-header',
    //Se agrega la plantilla html
    templateUrl: './header.component.html'
})
//Se exporta laa clase que sera importada en el module
export class HeaderComponent{
    title:string ='App Spring - Angular';
    authenticacion: boolean;

    constructor(public authService:AuthService, private router: Router){

    }


    ngAfterViewInit() {
      setTimeout(() => {
          this.authenticacion = this.authService.isAuthenticated();
      });
  }
    logout():void{
      swal.fire('Logout', `El usuario ${this.authService.usuario.username}, ha cerrado sesion con exito`, 'success');
      this.authService.logout();
      this.router.navigate(['/login']);
    }

}
