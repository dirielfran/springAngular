package com.eareiza.springAngular.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eareiza.springAngular.model.entity.Cliente;
import com.eareiza.springAngular.model.entity.Region;

public interface IClientesRepository extends JpaRepository<Cliente, Integer> {

	@Query("from Region")
	public List<Region> findAllRegiones();
}
