import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
//Se importan las librerias para el autocomplete de anfular material
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string;
  factura: Factura = new Factura();
  //Atributos del autocomplete de angular materia
  autoCompleteControl = new FormControl();
  //productos a ser recuperados
  productos: string[] = ['One', 'Two', 'Three'];
  //Areglo de productos filtrados
  productosFiltrados: Observable<Producto[]>;



  constructor(private clienteService: ClienteService,
              private facturasService: FacturasService,
              private ActivatedRoute: ActivatedRoute,
              private router:Router
            ) { }

  ngOnInit(): void {
    //Se asigna cliente al atributo factura
    this.ActivatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente=>this.factura.cliente=cliente);
    })
    //recupero los productos filtrados
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        //retorna todos antes de que cambie el imput
        //startWith(''),
        //Evalua si el item del observable es string en caso contrario accede al atributo nambre del obj
        map(value => typeof value === 'string' ? value : value.nombre),
        //Se evalua si hay valor lo retorna en caso contrario
        flatMap(value => value ? this._filter(value): [])
      );
  }


  //Metodo filter para el autocomplete de angular material
/*   private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    //filtra el valor pasado por parametro en el arreglo de productos
    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  } */

  //Metodo filter para el autocomplete de angular material
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    //filtra el valor pasado por parametro en el arreglo de productos
    return this.facturasService.getFiltroProducto(filterValue);
  }

  //Metodo que resuelve el nombre del producto en la vista
  public mostrarNombre(producto?:Producto):string | undefined{
    return producto ? producto.nombre : undefined;
  }

  //Metodo que captura el producto del autocomplete agrega un item a la factura
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    //Se optiene el objeto del evento y se castea a producto
    let producto = event.option.value as Producto;
    console.log(producto);

    //Valida si existe e incrementa, en caso contrario, crea un item a la factura
    if(this.existeItem(producto.id)){
      this.incrementaCant(producto.id);
    }else{
      //se crea nuevo itemFactura
      let newItem = new ItemFactura();
      //Se le asigna el producto al nuevo Item
      newItem.producto = producto;
      //Se agrega la linea a la factura
      this.factura.items.push(newItem);
    }

    //Se blanquea el autocomplete
    this.autoCompleteControl.setValue('');
    //Se deseclecciona
    event.option.focus();
    event.option.deselect();
  }

  actCantidad(idProducto:number,event:any): void{
    //Se obtiene la cantidad del objeto event y se castea a number
    let cantidad = event.target.value as number;

    //Valida la cantidad, si es 0 elimina el item
    if(cantidad == 0){
      return this.deleteItem(idProducto);
    }
    //se modifica la cantidad de cada item con el map
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      //Se valida el id del producto para poder modificar la cantidad
      if(idProducto === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  //valida si existe o no recorriendo la lista de items de la factura
  existeItem(idProducto:number):boolean{
    let existe = false;
    this.factura.items.forEach((item:ItemFactura) => {
      if(idProducto === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  //incrementa la cantidad del producto en el item
  incrementaCant(idProducto:number): void {
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      if(idProducto === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }

  //Metodo que elimina item
  deleteItem(idProducto: number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=> idProducto !== item.producto.id);
  }

  //Creacion de factura
  crearFactura(facturaForm): void{
    console.log(this.factura);
    //Se valida si la factura es igual a 0
    if(this.factura.items.length == 0){
      this.autoCompleteControl.setErrors({'invalid':true});
    }
    if(facturaForm.form.valid && this.factura.items.length > 0){
      this.facturasService.crearFactura(this.factura).subscribe(factura => {
        Swal.fire(this.titulo,`La Factura ${factura.descripcion} fue creada con exito.`, 'success');
        //this.router.navigate(['/clientes']);
        this.router.navigate(['/facturas', factura.id]);
      });
    }
  }
}
