package com.eareiza.springAngular.model.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import com.eareiza.springAngular.model.entity.Cliente;
import com.eareiza.springAngular.model.entity.Region;

public interface IClienteService {
	public List<Cliente> findAll();
	
	public Page<Cliente> findAll(Pageable pagina);
	
	public Cliente save(Cliente cliente);
	
	public Cliente findById(Integer id);
	
	public void delete(Integer id);
	
	public List<Region> findAllRegiones();
}
