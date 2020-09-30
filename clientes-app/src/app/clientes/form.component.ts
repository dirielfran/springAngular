import { Component, OnInit } from '@angular/core';
//Se importa Cliente
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute} from '@angular/router';
//Se importa la libreria de sweetAlert ya instalada
import Swal from 'sweetalert2';
import {Region} from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  //Se crea atributo de la clase databinding del formulario
  public  cliente: Cliente = new Cliente();
  //Se crea atributo de titulo que se renderiza en el formulario
  public  titulo: string ='Crear Cliente';
  //arreglo para los errores
  public errores: string[];
  //Lista de regiones
  regiones : Region[];

  //Se instancia atributos en el constructor
  constructor(private clienteService: ClienteService,
              private router: Router,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //Se llama al metodo cargar cliente
    this.cargarCliente();
    this.cargarRegiones();
  }

  cargarRegiones(): void{
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones)
  }

  //Se crea metodo que llama al metodo de la clase de servicio para obtener cliente por id
  cargarCliente(): void{
    //Obtine los parametros del formulario
    this.actRoute.params.subscribe(
      params => {
        //Obtiene el valor del id
        let id = params['id'];
        if(id){
          //Se llama al metodo de la clase de servicio
          this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
          console.log(this.cliente.apellido)
        }
      }
    )
  }

  //Se crea metodo invocado por el formulario
  public create(): void{
    //Se llama el metodo de la clase de servicio y se suscribe al observable
    this.clienteService.createCliente(this.cliente).subscribe(
      /* cliente => { */
        //Se cambia a json que es lo que recibe
        json => {
        this.router.navigate(['/clientes']);
        //Metodo de sweetAlert
        /* Swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} creado con exito!`, 'success'); */
        Swal.fire('Nuevo Cliente', `Cliente ${json.cliente.nombre} creado con exito!`, 'success');
      },
      //Recorrido de errores del backend
      err => {
        this.errores =  err.error.errores as string[];
        console.error('Codigo del error desde el backend '+err.status);
        console.error(err.error.errores);
      }
    )
  }

  //Metodo que llama al metodo update de cliente.service
  update():void{
    //Se llama a la clase de servici y se suscribe al metodo update
    this.clienteService.update(this.cliente).subscribe(

      cliente => {
        //Se navega hasta la url clientes
        this.router.navigate(['/clientes'])
        //Se realiza interpolacion `` para poder mostrar el nombre del cliente modificado
        Swal.fire('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con exito!`, 'success')
      },
      //Recorrido de errores del backend
      err => {
        this.errores =  err.error.errores as string[];
        console.error('Codigo del error desde el backend '+err.status);
        console.error(err.error.errores);
      }
    )
  }



  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
