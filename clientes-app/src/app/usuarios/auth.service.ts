import { Injectable } from '@angular/core';
import {Usuario} from './usuario';
import {Observable} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario:Usuario;
  private _token:string;

  constructor(private http:HttpClient) { }

  public get usuario():Usuario{
    //Se valida que no se null el usuario
    if(this._usuario != null){
      return this._usuario;
      //Si es null lo buscamos en el sessionstorage
    }else if(this._usuario == null && sessionStorage.getItem('usuario')!=null){
      //se recupera del sessionStorage y se convierte en json, luego se castea a usuario
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
    return new Usuario();
  }


  public get token():string{
    //Se valida que no se null el token
    if(this._token != null){
      return this._token;
      //Si es null lo buscamos en el sessionstorage
    }else if(this._token == null && sessionStorage.getItem('token')!=null){
      //se recupera del sessionStorage el token
      this._token = sessionStorage.getItem('token');
    }
    return null;
  }

  login(usuario:Usuario):Observable<any>{
    const urlEndPoint ='http://localhost:8080/oauth/token';
    //credenciales de la aplicacion encriptada en base64 con la funcion btoa
    const credenciales = btoa('angularapp'+':'+'12345');
    //headers de la peticion
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization': 'Basic '+ credenciales});
    //Parametros
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(accessToken:string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken:string):void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  //metodo que obtiene los datos del token en un json
  obtenerDatosToken(accessToken:string):any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }

  logout():void{
    this._usuario = null;
    this._token = null;
    //Se borra todo del sessionStorage
    //sessionStorage.clear();
    //Se borra porl elemento del sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
