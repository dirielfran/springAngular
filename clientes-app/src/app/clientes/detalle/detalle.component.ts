import { Component, OnInit, Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {ModalService} from './modal.service';
import {AuthService} from '../../usuarios/auth.service';
import { FacturasService } from '../../facturas/services/facturas.service';
import { Factura } from '../../facturas/models/factura';



@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string ='Detalle del Cliente';
  fotoSeleccionada: File;
  progreso: number = 0;


  constructor(private clienteService: ClienteService,
                  private facturaService: FacturasService,
                  public modalService: ModalService,
                  public authService: AuthService) { }

  ngOnInit(): void {
    /* this.activatedRoute.paramMap.subscribe(params =>{
      let id: number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        });
      }
    }); */
  }

  //metodo que obtiene el archivo
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    //Validacion para que el archivo sea de tipo imagen
    if(this.fotoSeleccionada.type.indexOf('image') < 0 ){
      swal.fire('Error al seleccionar el archivo', 'El archivo debe ser de tipo imagen', 'error');
      //Se setea a null para que no pueda ser enviado
      this.fotoSeleccionada = null;
    }
  }
  //metodo que llama al metodo subirFoto de la clase de servicio
  subirFoto(){
    //Se valida si selecciono un archivo
    if(!this.fotoSeleccionada){
      swal.fire('Error Upload', 'Debe seleccionar una foto','error')
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            //Se notifica el cambio del cliente
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido', response.mensaje, 'success');
          }
        }
      )
    }
  }

  cerrarModal(){
    console.log('Llegue');
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  deleteFactura(factura:Factura): void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta usted seguro?',
      text: `Desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.facturaService.deleteFactura(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            swalWithBootstrapButtons.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con exito.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons .fire(
          'Cancelado',
          'La opcion de eliminar ha sido cancelada.',
          'error'
        )
      }
    })
  }
}
