package com.eareiza.springAngular.comproller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eareiza.springAngular.model.entity.Producto;
import com.eareiza.springAngular.model.service.IProductoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200"})
public class ProductoController {
	
	@Autowired
	private IProductoService productoServ;
	
	@GetMapping("/facturas/filtrarProducto/{term}")
	@ResponseStatus(HttpStatus.OK)
	public List<Producto> filtrarProducto(@PathVariable("term") String termino){
		return productoServ.findProductoByNombre(termino);
	}

}
