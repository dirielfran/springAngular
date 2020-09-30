package com.eareiza.springAngular.model.service;

import com.eareiza.springAngular.model.entity.Factura;

public interface IFacturaService {
	
	Factura findById(Long idFactura);
	
	Factura saveFactura(Factura factura);
	
	void deleteFactura(Long idFactura);

}
