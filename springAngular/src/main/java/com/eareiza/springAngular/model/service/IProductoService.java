package com.eareiza.springAngular.model.service;

import java.util.List;

import com.eareiza.springAngular.model.entity.Producto;

public interface IProductoService {
	List<Producto> findProductoByNombre(String nombre);
}
