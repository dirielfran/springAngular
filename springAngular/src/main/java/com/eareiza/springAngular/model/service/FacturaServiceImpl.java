package com.eareiza.springAngular.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eareiza.springAngular.model.entity.Factura;
import com.eareiza.springAngular.model.repository.IFacturaRepository;

@Service
public class FacturaServiceImpl implements IFacturaService {

	@Autowired
	private IFacturaRepository facturasRepo;
	
	@Override
	@Transactional(readOnly = true)
	public Factura findById(Long idFactura) {
		return facturasRepo.findById(idFactura).orElse(null);
	}

	@Override
	@Transactional
	public Factura saveFactura(Factura factura) {
		return facturasRepo.save(factura);
	}

	@Override
	@Transactional
	public void deleteFactura(Long idFactura) {
		facturasRepo.deleteById(idFactura);
	}

}
