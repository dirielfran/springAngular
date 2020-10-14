import { Component, OnInit } from '@angular/core';
//Se importa la clase cliente
import { Cliente } from './cliente';
//Se importa la clase de servicio
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service'
//Se importa la libreria de sweetAlert ya instalada
import Swal from 'sweetalert2'
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  //Se crea la lista de objs Cliente
  clientes: Cliente[];
  //Atributo para la paginacion
  paginador: any;
  //Atributo para el upload
  clienteSeleccionado: Cliente;

  //Se crea variable en el const. y se le inyecta la clase de servicio
  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService) { }

  //Se crea cuando se inicia el componente
  ngOnInit() {
    //Se le añade observador paramMap
    this.activatedRoute.paramMap.subscribe( params => {
        //Se agrega atributo que recupera la pagina dinamicamente
        let page:number = +params.get('page');
        if(!page){
          page =0;
        }
        //se suscribe el observable al observador
        //Observador
        //ae añade pipe, para añadir operadores
        this.clienteService.getClientes(page).pipe(
          tap(response =>{
              (response.content as Cliente[]).forEach(element => console.log(element.nombre))
          })
        ).subscribe(
          //funcion anonima
          //observador, actualiza el listado de clientes
          response => {
            this.clientes = (response.content as Cliente[]);
            //Se da valor al paginador
            this.paginador = response;
          });
      });

      this.modalService.notificarUpload.subscribe(cliente =>{
        this.clientes = this.clientes.map(clienteOriginal =>{
          if(cliente.id == clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        });
      });
  }

  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta usted seguro?',
      text: `Desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La opcion de eliminar ha sido cancelada.',
          'error'
        )
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
