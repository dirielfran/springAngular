import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por favor hacer Sing-In';

  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    //Se inicializa el objeto usuario
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    //Se valida si el usuario esta autenticado
    //if(this.authService.isAuthenticated()){
    //  swal.fire('Login', `El usuario ${this.authService.usuario.username} ya se encuentra autenticado`, 'info');
    //  this.router.navigate(['/clientes']);
    //}
  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire('Error Login', 'Username o password vacio', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response=>{
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      this.router.navigate(['/clientes']);
      let usuario: Usuario = this.authService.usuario;
      swal.fire('Login', `Hola ${usuario.username}, has iniciado sesion con exito!`,'success' );
    //Se valida el error 400
    }, err => {
      if (err.status == 400){
        swal.fire('Error Login', 'Username o password Incorrectos!', 'error');
      }
    });
  }
}
