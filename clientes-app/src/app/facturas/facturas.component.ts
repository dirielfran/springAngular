import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
//Se importan las librerias para el autocomplete de anfular material
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';


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
              private ActivatedRoute: ActivatedRoute) { }

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

    //se crea nuevo itemFactura
    let newItem = new ItemFactura();
    //Se le asigna el producto al nuevo Item
    newItem.producto = producto;
    //Se agrega la linea a la factura
    this.factura.items.push(newItem);

    //Se blanquea el autocomplete
    this.autoCompleteControl.setValue('');
    //Se deseclecciona
    event.option.focus();
    event.option.deselect();
  }

  actCantidad(idProducto:number,event:any): void{
    //Se obtiene la cantidad del objeto event y se castea a number
    let cantidad = event.target.value as number;

    //se modifica la cantidad de cada item con el map
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      //Se valida el id del producto para poder modificar la cantidad
      if(idProducto === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }
}
