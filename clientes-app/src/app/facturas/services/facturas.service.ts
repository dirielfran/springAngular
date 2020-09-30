import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private urlEndPoint: string = 'http://localhost:8080/api/facturas';
  constructor(private httpCliente: HttpClient) { }

  getFactura(id: number):Observable<Factura>{
    return  this.httpCliente.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  deleteFactura(id: number): Observable<void>{
    return this.httpCliente.delete<void>(`${this.urlEndPoint}/${id}`);
  }
}
