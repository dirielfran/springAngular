package com.eareiza.springAngular.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.eareiza.springAngular.model.entity.Producto;
import com.eareiza.springAngular.model.repository.IProductoRepository;

@Service
public class ProductoServiceImpl implements IProductoService {
	
	@Autowired
	private IProductoRepository productoRepo;

	@Override
	@Transactional(readOnly = true)
	public List<Producto> findProductoByNombre(String nombre) {
		return productoRepo.findByNombreContainingIgnoreCase(nombre);
	}
}
